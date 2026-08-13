const fs = require('fs');
const path = require('path');

// Leer contenido de archivos
function getFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return '';
  }
}

// Función para encontrar métodos/propiedades no utilizados
function findUnused() {
  const projectRoot = process.cwd();
  
  const files = {
    basePage: path.join(projectRoot, 'pages/BasePage.ts'),
    todoActions: path.join(projectRoot, 'pages/TodoActions.ts'),
    todoPage: path.join(projectRoot, 'pages/locators/TodoPage.ts'),
    exerciseSpec: path.join(projectRoot, 'tests/exercise-todo.spec.ts'),
  };

  const contents = {
    basePage: getFileContent(files.basePage),
    todoActions: getFileContent(files.todoActions),
    todoPage: getFileContent(files.todoPage),
    exerciseSpec: getFileContent(files.exerciseSpec),
  };

  const unused = {
    methods: [],
    locators: []
  };

  // Métodos en BasePage
  const basePageMethods = Array.from(contents.basePage.matchAll(/async\s+(\w+)\s*\(/g), m => m[1]);
  basePageMethods.forEach(method => {
    const isUsed = 
      contents.todoActions.includes(`this.${method}(`) ||
      contents.todoPage.includes(`this.${method}(`) ||
      contents.exerciseSpec.includes(`${method}(`);
    
    if (!isUsed && method !== 'constructor') {
      unused.methods.push({ name: method, file: 'BasePage.ts', line: getLineNumber(contents.basePage, method) });
    }
  });

  // Métodos en TodoActions
  const todoActionsMethods = Array.from(contents.todoActions.matchAll(/async\s+(\w+)\s*\(/g), m => m[1]);
  todoActionsMethods.forEach(method => {
    const isUsed = 
      contents.exerciseSpec.includes(`todoActions.${method}(`) ||
      contents.todoActions.includes(`.${method}(`);
    
    if (!isUsed && method !== 'constructor') {
      unused.methods.push({ name: method, file: 'TodoActions.ts', line: getLineNumber(contents.todoActions, method) });
    }
  });

  // Locators en TodoPage
  const todoLocators = Array.from(contents.todoPage.matchAll(/static\s+(\w+)\s*=/g), m => m[1]);
  todoLocators.forEach(locator => {
    const isUsed = 
      contents.todoActions.includes(`Todo.${locator}`) ||
      contents.basePage.includes(`Todo.${locator}`);
    
    if (!isUsed) {
      unused.locators.push({ name: locator, file: 'TodoPage.ts', line: getLineNumber(contents.todoPage, locator) });
    }
  });

  return unused;
}

function getLineNumber(content, name) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(name)) {
      return i + 1;
    }
  }
  return 0;
}

module.exports = {
  rules: {
    'no-unused': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detect unused methods and locators',
          category: 'Best Practices',
        },
        fixable: null,
        schema: [],
      },
      create(context) {
        const filePath = context.filename;
        const unused = findUnused();

        return {
          Program(node) {
            if (!filePath.includes('pages/') && !filePath.includes('tests/')) {
              return;
            }
            
            // Report métodos no utilizados
            unused.methods.forEach(item => {
              if (filePath.includes(item.file)) {
                context.report({
                  node,
                  message: `Method '${item.name}' is not used`,
                });
              }
            });

            // Report locators no utilizados
            unused.locators.forEach(item => {
              if (filePath.includes(item.file)) {
                context.report({
                  node,
                  message: `Locator '${item.name}' is not used`,
                });
              }
            });
          }
        };
      }
    }
  }
};
