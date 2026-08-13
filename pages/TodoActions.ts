import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Todo } from './locators/TodoPage';

export class TodoActions extends BasePage {
  private readonly inputNewTodo: Locator;
  private readonly liTodoItem: Locator;
  private readonly spanCountItems: Locator;
  private readonly aFilterActive: Locator;
  private readonly aFilterCompleted: Locator;
  private readonly aFilterAll: Locator;
  private readonly buttonClearCompleted: Locator;

  constructor(page: Page) {
    super(page);
    this.inputNewTodo = page.locator(Todo.inputNewTodo);
    this.liTodoItem = page.locator(Todo.liTodoItem);
    this.spanCountItems = page.locator(Todo.spanCountItems);
    this.aFilterActive = page.locator(Todo.aFilterActive);
    this.aFilterCompleted = page.locator(Todo.aFilterCompleted);
    this.aFilterAll = page.locator(Todo.aFilterAll);
    this.buttonClearCompleted = page.locator(Todo.buttonClearCompleted);
  }

  public async goToPage(url: string) {
    await this.navigateTo(url, this.inputNewTodo);
  }

  public async createTodoItem(todo: string) {
    await this.fill(this.inputNewTodo, todo);
    await this.page.keyboard.press('Enter');
    await this.expectVisible(this.liTodoItem.locator(`text=${todo}`));
  }

  public async validateNumberOfItems(count: string) {
    await expect(this.spanCountItems).toContainText(count);
  }

  public async toggleTodoItem(todo: string, status: string) {
    const todoItem: Locator = this.liTodoItem.filter({
      has: this.page.locator(`text=\"${todo}\"`),
    });
    await this.click(todoItem.locator(Todo.inputTodoToogle));
    await expect(todoItem).toHaveClass(status);
  }

  public async verifyActiveItems(count: number) {
    await this.click(this.aFilterActive);
    await expect(this.page.locator(`${Todo.liTodoItem}:not(.completed)`)).toHaveCount(count);
  }

  public async verifyCompletedItems(count: number) {
    let unusedVariable: string;
    await this.click(this.aFilterCompleted);
    await expect(this.page.locator(`${Todo.liTodoItem}.completed`)).toHaveCount(count);
  }

  public async verifyAllItems(count: number) {
    await this.click(this.aFilterAll);
    await expect(this.liTodoItem).toHaveCount(count);
  }

  public async deleteTodoItem(todo: string) {
    const todoItem: Locator = this.liTodoItem.filter({
      has: this.page.locator(`text=\"${todo}\"`),
    });
    await todoItem.hover();
    await this.click(todoItem.locator(Todo.buttonTodoDelete));
    await expect(todoItem).toHaveCount(0);
  }

  public async clearCompletedItems(count: number) {
    await this.click(this.buttonClearCompleted);
    await expect(this.liTodoItem).toHaveCount(count);
  }
}
