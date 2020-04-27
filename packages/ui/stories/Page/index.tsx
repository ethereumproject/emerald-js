/*
Copyright 2019 ETCDEV GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { Back, Box } from '@emeraldplatform/ui-icons';
import Typography from '@material-ui/core/Typography';
import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Page, { PageTitle } from '../../src/components/Page';

storiesOf('Page', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <div>
      <Page title={text('title', 'Title Here')} leftIcon={<Back onClick={action('Left Icon onClick')}/>}>
        <Typography>Im a page content</Typography>
      </Page>
    </div>
  ))
  .add('without left icon', () => (
    <div>
      <Page title={text('title', 'Without left icon')}>
        <Typography>Im a page content</Typography>
      </Page>
    </div>
  ))
  .add('title component', () => (
    <Page title={(<div style={{ display: 'flex' }}><Box /><PageTitle>Title with icon</PageTitle></div>)}>
      <Typography>Im a page content</Typography>
    </Page>
  ))
  .add('left and right icons', () => (
    <Page
      title={(<div>Page title component</div>)}
      leftIcon={<Back onClick={action('onBack')}/>}
      rightIcon={<Back />}
    >
      <Typography>Im a page content</Typography>
    </Page>
  ));
