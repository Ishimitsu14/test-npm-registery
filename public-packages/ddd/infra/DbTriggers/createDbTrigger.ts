import { v4 } from 'uuid';

import { DbTrigger, DbTriggerAction } from './DbTrigger';

export function createDbTrigger<Args extends any[] = []>(autoCleanWhenExecuted: boolean): DbTrigger<Args> {
  const triggers: Map<string, DbTriggerAction<Args>> = new Map();
  const onceTriggers: Map<string, DbTriggerAction<Args>> = new Map();

  const getActions = () => [...triggers.values(), ...onceTriggers.values()];
  const getActionsMap = () => [...triggers, ...onceTriggers];

  const addAction = (callback: DbTriggerAction<Args>) => {
    const id = v4();
    triggers.set(id, callback);
    return id;
  };

  const onceAction = (callback: DbTriggerAction<Args>) => {
    const id = addAction(callback);
    onceTriggers.set(id, callback);
    return id;
  };

  const removeAction = (callback: DbTriggerAction<Args> | string) => {
    if (typeof callback === 'string') {
      triggers.delete(callback);
      onceTriggers.delete(callback);
    } else {
      const triggerId = getActionsMap().find(([, _callback]) => _callback === callback);
      if (triggerId) {
        triggers.delete(triggerId[0]);
        onceTriggers.delete(triggerId[0]);
      }
    }
  };

  const cleanActions = () => {
    triggers.clear();
    onceTriggers.clear();
  };

  const executeActions = async (...args: Args) => {
    let i = 0;
    const triggers = getActionsMap();

    for (const [id, trigger] of triggers) {
      if (onceTriggers.has(id)) {
        removeAction(id);
      }
      await trigger(...args);
      i++;
    }

    if (autoCleanWhenExecuted) cleanActions();

    return i;
  };

  return {
    get size() {
      return triggers.size + onceTriggers.size;
    },
    getActions,
    getActionsMap,
    addAction,
    onceAction,
    removeAction,
    cleanActions,
    executeActions,
  };
}
