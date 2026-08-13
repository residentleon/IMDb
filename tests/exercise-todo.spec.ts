import { TodoActions } from '../pages/TodoActions';

import data from '../data/data.json';

import { test } from '@playwright/test';

test('@smoke TC01 - Full todo workflow (add, complete, filter, delete)', async ({ page }) => {
  const todoActions = new TodoActions(page);

  await test.step('Navigate to Todo application', async () => {
    await todoActions.goToPage(data.todomvcURL);
  });

  await test.step('Create todo item "' + data.TC01.item1 + '"', async () => {
    await todoActions.createTodoItem(data.TC01.item1);
  });

  await test.step('Create todo item "' + data.TC01.item2 + '"', async () => {
    await todoActions.createTodoItem(data.TC01.item2);
  });

  await test.step('Create todo item "' + data.TC01.item3 + '"', async () => {
    await todoActions.createTodoItem(data.TC01.item3);
  });

  await test.step(
    'Validate total number of items should be "' + data.TC01.totalItems + '"',
    async () => {
      await todoActions.validateNumberOfItems(data.TC01.totalItems);
    }
  );

  await test.step('Toggle item as completed "' + data.TC01.item1 + '"', async () => {
    await todoActions.toggleTodoItem(data.TC01.item1, data.TC01.status);
  });

  await test.step(
    'Verify active items counts should be "' + data.TC01.activeItems + '"',
    async () => {
      await todoActions.verifyActiveItems(parseInt(data.TC01.activeItems));
    }
  );

  await test.step(
    'Verify completed items counts should be "' + data.TC01.completedItems + '"',
    async () => {
      await todoActions.verifyCompletedItems(parseInt(data.TC01.completedItems));
    }
  );

  await test.step('Verify all items counts should be "' + data.TC01.totalItems + '"', async () => {
    await todoActions.verifyAllItems(parseInt(data.TC01.totalItems));
  });

  await test.step('Delete item "' + data.TC01.item3 + '"', async () => {
    await todoActions.deleteTodoItem(data.TC01.item3);
  });

  await test.step(
    'Verify final count after deletion should be "' + (parseInt(data.TC01.totalItems) - 1) + '"',
    async () => {
      await todoActions.verifyAllItems(parseInt(data.TC01.totalItems) - 1);
    }
  );
});

test('@smoke @regression TC02 - Clear completed removes items and updates count', async ({
  page,
}) => {
  const todoActions = new TodoActions(page);

  await test.step('Navigate to Todo application', async () => {
    await todoActions.goToPage(data.todomvcURL);
  });

  await test.step('Create todo item "' + data.TC02.item1 + '"', async () => {
    await todoActions.createTodoItem(data.TC02.item1);
  });

  await test.step('Create todo item "' + data.TC02.item2 + '"', async () => {
    await todoActions.createTodoItem(data.TC02.item2);
  });

  await test.step('Create todo item "' + data.TC02.item3 + '"', async () => {
    await todoActions.createTodoItem(data.TC02.item3);
  });

  await test.step('Create todo item "' + data.TC02.item4 + '"', async () => {
    await todoActions.createTodoItem(data.TC02.item4);
  });

  await test.step('Verify all 4 items are created', async () => {
    await todoActions.verifyAllItems(parseInt(data.TC02.firtBlockOfItems));
  });

  await test.step('Mark item as completed "' + data.TC02.item1 + '"', async () => {
    await todoActions.toggleTodoItem(data.TC02.item1, data.TC02.status);
  });

  await test.step('Mark item as completed "' + data.TC02.item2 + '"', async () => {
    await todoActions.toggleTodoItem(data.TC02.item2, data.TC02.status);
  });

  await test.step('Mark item as completed "' + data.TC02.item3 + '"', async () => {
    await todoActions.toggleTodoItem(data.TC02.item3, data.TC02.status);
  });

  await test.step('Create todo item "' + data.TC02.item5 + '"', async () => {
    await todoActions.createTodoItem(data.TC02.item5);
  });

  await test.step('Create todo item "' + data.TC02.item6 + '"', async () => {
    await todoActions.createTodoItem(data.TC02.item6);
  });

  await test.step('Create todo item "' + data.TC02.item7 + '"', async () => {
    await todoActions.createTodoItem(data.TC02.item7);
  });

  await test.step('Verify all 7 items are present', async () => {
    await todoActions.verifyAllItems(
      parseInt(data.TC02.firtBlockOfItems) + parseInt(data.TC02.secondBlockOfItems)
    );
  });

  await test.step('Mark item as completed "' + data.TC02.item4 + '"', async () => {
    await todoActions.toggleTodoItem(data.TC02.item4, data.TC02.status);
  });

  await test.step('Mark item as completed "' + data.TC02.item5 + '"', async () => {
    await todoActions.toggleTodoItem(data.TC02.item5, data.TC02.status);
  });

  await test.step('Mark item as completed "' + data.TC02.item6 + '"', async () => {
    await todoActions.toggleTodoItem(data.TC02.item6, data.TC02.status);
  });

  await test.step('Create todo item "' + data.TC02.item8 + '"', async () => {
    await todoActions.createTodoItem(data.TC02.item8);
  });

  await test.step('Mark item as completed "' + data.TC02.item8 + '"', async () => {
    await todoActions.toggleTodoItem(data.TC02.item8, data.TC02.status);
  });

  await test.step('Verify active items counts should be ' + data.TC02.activeItems, async () => {
    await todoActions.verifyActiveItems(parseInt(data.TC02.activeItems));
  });

  await test.step(
    'Verify completed items counts should be ' + data.TC02.completedItems,
    async () => {
      await todoActions.verifyCompletedItems(parseInt(data.TC02.completedItems));
    }
  );

  await test.step('Verify total items counts should be ' + data.TC02.totalItems, async () => {
    await todoActions.verifyAllItems(parseInt(data.TC02.totalItems));
  });

  await test.step(
    'Clear all completed items should leave ' + data.TC02.activeItems + ' active items',
    async () => {
      await todoActions.clearCompletedItems(parseInt(data.TC02.activeItems));
    }
  );

  await test.step(
    'Validate only active items remain should be ' + data.TC02.activeItems,
    async () => {
      await todoActions.validateNumberOfItems(data.TC02.activeItems);
    }
  );
});
