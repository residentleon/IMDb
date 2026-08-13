#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';

type UnusedItemType = 'Method' | 'Property' | 'Variable' | 'Test data';

interface UnusedItem {
  type: UnusedItemType;
  name: string;
  file: string;
  lineNumber: number;
  lineContent: string;
  link: string;
}

interface LineInfo {
  lineNumber: number;
  lineContent: string;
}

const projectRoot = path.dirname(path.resolve(process.argv[1] ?? '.'));

// Configuration for file scanning
const config = {
  sourceDirectories: ['pages', 'src', 'lib', 'utils', 'tests', 'test', '__tests__'],
  dataDirectories: ['data', 'fixtures', 'test-data'],
  excludedDirectories: new Set([
    'node_modules',
    '.git',
    'playwright-report',
    'test-results',
    'coverage',
  ]),
  sourceFilePattern: /\.(ts|tsx|js|jsx)$/,
  dataFilePattern: /\.json$/,
};

function getAllFiles(
  dirPath: string,
  filePattern: RegExp,
  fileList: string[] = []
): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !config.excludedDirectories.has(file)) {
      getAllFiles(filePath, filePattern, fileList);
    } else if (stat.isFile() && filePattern.test(filePath)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function getFilesFromDirectories(directories: string[], pattern: RegExp): string[] {
  const files: string[] = [];
  directories.forEach((directory) => {
    const directoryPath = path.join(projectRoot, directory);
    if (fs.existsSync(directoryPath)) {
      files.push(...getAllFiles(directoryPath, pattern));
    }
  });
  return files;
}

function getLineInfo(content: string, pattern: RegExp): LineInfo {
  const lines = content.split('\n');
  const lineIndex = lines.findIndex((line) => pattern.test(line));

  return lineIndex === -1
    ? { lineNumber: 0, lineContent: '' }
    : { lineNumber: lineIndex + 1, lineContent: lines[lineIndex].trim() };
}

function createLink(file: string, lineNumber: number): string {
  const absolutePath = path.resolve(projectRoot, file).replace(/\\/g, '/');
  return `file://${absolutePath}:${lineNumber}`;
}

function getRelativePath(filePath: string): string {
  return path.relative(projectRoot, filePath);
}

function readAllFiles(files: string[]): Record<string, string> {
  const contents: Record<string, string> = {};
  files.forEach((file) => {
    contents[file] = fs.readFileSync(file, 'utf8');
  });
  return contents;
}

// Main execution
const sourceFiles = getFilesFromDirectories(config.sourceDirectories, config.sourceFilePattern).filter(
  (filePath) => path.basename(filePath) !== 'find-unused-methods.ts'
);
const dataFiles = getFilesFromDirectories(config.dataDirectories, config.dataFilePattern);
const allFiles = [...sourceFiles, ...dataFiles];

if (allFiles.length === 0) {
  console.log('\n⚠️  No TypeScript files found in configured directories.\n');
  process.exit(1);
}

const fileContents = readAllFiles(allFiles);
const sourceContent = sourceFiles.map((filePath) => fileContents[filePath]).join('\n');
const unusedItems: UnusedItem[] = [];

// Analyze each source file
sourceFiles.forEach((filePath) => {
  const content = fileContents[filePath];
  const relativePath = getRelativePath(filePath);

  // Find methods with or without the async modifier.
  const methods = Array.from(
    content.matchAll(/(?:(?:public|private|protected|static|readonly|async)\s+)*(\w+)\s*\([^)]*\)\s*\{/g),
    (match) => match[1]
  );

  methods.forEach((method) => {
    const isUsedInFile = new RegExp(`this\\.${method}\\(`).test(content);
    const declarationPattern = new RegExp(
      `(?:(?:public|private|protected|static|readonly|async)\\s+)*${method}\\s*\\([^)]*\\)\\s*\\{`
    );
    const contentWithoutDeclaration = content.replace(declarationPattern, '');
    const externalUsage = new RegExp(`\\b(?:\\w+\\.)?${method}\\s*\\(`).test(
      sourceContent.replace(content, contentWithoutDeclaration)
    );

    if (!isUsedInFile && !externalUsage) {
      const lineInfo = getLineInfo(content, declarationPattern);
      if (lineInfo.lineNumber > 0) {
        unusedItems.push({
          type: 'Method',
          name: method,
          file: relativePath,
          ...lineInfo,
          link: createLink(relativePath, lineInfo.lineNumber),
        });
      }
    }
  });

  // Find all static properties (like locators)
  const properties = Array.from(
    content.matchAll(/static\s+(?:readonly\s+)?(\w+)\s*(?::|=)/g),
    (match) => match[1]
  );

  properties.forEach((property) => {
    const isUsed = new RegExp(`\\.${property}\\b`).test(sourceContent);

    if (!isUsed) {
      const lineInfo = getLineInfo(content, new RegExp(`static\\s+(?:readonly\\s+)?${property}\\s*(?::|=)`));
      if (lineInfo.lineNumber > 0) {
        unusedItems.push({
          type: 'Property',
          name: property,
          file: relativePath,
          ...lineInfo,
          link: createLink(relativePath, lineInfo.lineNumber),
        });
      }
    }
  });

  // Find local variables (only in source files, not tests)
  const variables = Array.from(
    content.matchAll(/\b(?:let|const|var)\s+(\w+)\b/g),
    (match) => match[1]
  );

  variables.forEach((variable) => {
    const pattern = new RegExp(`\\b${variable}\\b`, 'g');
    const occurrences = content.match(pattern) ?? [];

    // Only flag if used only once (declared but not used).
    if (occurrences.length === 1) {
      const lineInfo = getLineInfo(content, new RegExp(`\\b(?:let|const|var)\\s+${variable}\\b`));
      if (lineInfo.lineNumber > 0) {
        unusedItems.push({
          type: 'Variable',
          name: variable,
          file: relativePath,
          ...lineInfo,
          link: createLink(relativePath, lineInfo.lineNumber),
        });
      }
    }
  });
});

function getJsonLeaves(value: unknown, pathParts: string[] = []): string[][] {
  if (value === null || typeof value !== 'object') {
    return [pathParts];
  }

  return Object.entries(value).flatMap(([key, childValue]) =>
    getJsonLeaves(childValue, [...pathParts, key])
  );
}

dataFiles.forEach((filePath) => {
  const relativePath = getRelativePath(filePath);
  const content = fileContents[filePath];
  const data = JSON.parse(content) as unknown;

  getJsonLeaves(data).forEach((pathParts) => {
    const propertyName = pathParts[pathParts.length - 1];
    if (!propertyName) return;

    const propertyUsage = new RegExp(`(?:\\.|['\"]|\\b)${propertyName}(?:['\"]|\\b)`).test(
      sourceContent
    );

    if (!propertyUsage) {
      const lineInfo = getLineInfo(content, new RegExp(`['\"]${propertyName}['\"]\\s*:`));
      if (lineInfo.lineNumber > 0) {
        unusedItems.push({
          type: 'Test data',
          name: pathParts.join('.'),
          file: relativePath,
          ...lineInfo,
          link: createLink(relativePath, lineInfo.lineNumber),
        });
      }
    }
  });
});

// Display results
if (unusedItems.length === 0) {
  console.log('\n✓ All items are being used!\n');
  process.exit(0);
}

console.log('\n⚠️  UNUSED CODE:\n');
console.log('═'.repeat(100));
unusedItems.forEach((item, index) => {
  console.log(`\n${index + 1}. ${item.type}: ${item.name}`);
  console.log(`   📄 ${item.file}:${item.lineNumber}`);
  console.log(`   📍 ${item.link}`);
  console.log(`   💻 ${item.lineContent}`);
});
console.log('\n' + '═'.repeat(100));
console.log(`\nTotal unused: ${unusedItems.length}\n`);

process.exit(0);
