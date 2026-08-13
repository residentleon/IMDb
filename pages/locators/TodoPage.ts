export class Todo {
  static readonly inputNewTodo = 'input.new-todo';
  static readonly liTodoItem = 'li[data-testid="todo-item"]';
  static readonly inputTodoToogle = 'input[aria-label="Toggle Todo"]';
  static readonly spanCountItems = 'span.todo-count';
  static readonly aFilterActive = 'a[href="#/active"]';
  static readonly aFilterCompleted = 'a[href="#/completed"]';
  static readonly aFilterAll = 'a[href="#/"]';
  static readonly buttonTodoDelete = 'button.destroy';
  static readonly buttonClearCompleted = 'button.clear-completed';
  static readonly unusedLocator = 'unused-locator';
}
