import { html, TemplateResult } from 'lit';
import '../src/app-root.js';

export default {
  title: 'AppRoot',
  component: 'app-root',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  header?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({ header, backgroundColor = 'white' }: ArgTypes) => html`
  <app-root style="--app-root-background-color: ${backgroundColor}" .header=${header}></app-root>
`;

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
