/** @flow */
import R from 'ramda';
import chalk from 'chalk';
import Command from '../../command';
import { listInline, listScope } from '../../../api/consumer';
import Component from '../../../consumer/component';
import { formatBit, paintHeader } from '../../chalk-box';

export default class List extends Command {
  name = 'list [scope]';
  description = 'list all scope components';
  alias = 'ls';
  opts = [
    ['i', 'inline', 'in inline bit']
  ];
  
  action([scope]: string[], { inline }: { inline: ?bool }): Promise<any> {
    function list() {
      if (inline) return listInline();
      return listScope(scope);
    }

    return list().then(components => ({
      components,
      scope,
      inline
    }));
  }

  report({ components, scope, inline }: {
    components: Component[],
    scope: ?string,
    inline: ?bool
  }): string {
    function decideHeaderSentence() {
      if (inline) return 'inline_components directory';
      if (!scope) return 'local scope';
      return `the scope ${scope}`;
    }

    if (R.isEmpty(components)) {
      return chalk.red(`${decideHeaderSentence()} is empty`);  
    }

    return R.prepend(
      paintHeader(decideHeaderSentence()),
      components.map(formatBit)
    ).join('\n');
  }

}