import { Skeleton, Title } from '@patternfly/react-core';
import React, { Component } from 'react';
import { LoadingPageSpinner, Main } from 'src/components';

export class LoadingPageWithHeader extends Component {
  render() {
    return (
      <>
        <section
          className={
            'pf-l-page-header pf-c-page-header pf-l-page__main-section pf-c-page__main-section pf-m-light'
          }
        >
          <Title headingLevel='h1'>
            <Skeleton />
          </Title>
        </section>
        <Main>
          <section>
            <LoadingPageSpinner />
          </section>
        </Main>
      </>
    );
  }
}
