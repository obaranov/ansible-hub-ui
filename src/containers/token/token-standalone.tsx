import { Trans, t } from '@lingui/macro';
import { Button, Card, CardBody, CardTitle } from '@patternfly/react-core';
import React, { Component } from 'react';
import { ActiveUserAPI } from 'src/api';
import {
  AlertList,
  AlertType,
  BaseHeader,
  ClipboardCopy,
  DateComponent,
  EmptyStateUnauthorized,
  LoadingPageSpinner,
  Main,
  closeAlertMixin,
} from 'src/components';
import { AppContext, IAppContextType } from 'src/loaders/app-context';
import { RouteProps, withRouter } from 'src/utilities';
import { errorMessage } from 'src/utilities';
import './token.scss';

interface IState {
  token: string;
  alerts: AlertType[];
  loadingToken: boolean;
}

class TokenStandalone extends Component<RouteProps, IState> {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      token: undefined,
      alerts: [],
      loadingToken: false,
    };
  }

  render() {
    const { token, alerts, loadingToken } = this.state;
    const unauthorised =
      !(this.context as IAppContextType).user ||
      (this.context as IAppContextType).user.is_anonymous;
    const expiration = (this.context as IAppContextType).settings
      .GALAXY_TOKEN_EXPIRATION;
    const expirationDate = expiration
      ? new Date(Date.now() + 1000 * 60 * expiration)
      : null;
    const isSSO =
      !(this.context as IAppContextType).user.auth_provider.includes(
        'django',
      ) &&
      !(this.context as IAppContextType).user.auth_provider.includes('github');

    return (
      <>
        <AlertList alerts={alerts} closeAlert={(i) => this.closeAlert(i)} />
        <BaseHeader title={t`API token`} />
        <Main>
          {unauthorised ? (
            <EmptyStateUnauthorized />
          ) : (
            <Card>
              <section className='body pf-c-content'>
                <CardTitle>
                  <h2>{t`API token`}</h2>
                </CardTitle>
                <CardBody>
                  <p>
                    <Trans>
                      Use this token to authenticate the{' '}
                      <code>ansible-galaxy</code> client.
                    </Trans>
                  </p>
                  {isSSO && (
                    <div>
                      <h2>{t`Expiration`}</h2>
                      <p>
                        <Trans>You are an SSO user.</Trans>{' '}
                        {expirationDate ? (
                          <Trans>
                            Your token will expire{' '}
                            <DateComponent
                              date={expirationDate.toISOString()}
                            />
                            .
                          </Trans>
                        ) : (
                          <Trans>Your token will not expire.</Trans>
                        )}
                      </p>
                    </div>
                  )}
                  <div className='pf-c-content'>
                    <Trans>
                      <b>WARNING</b> loading a new token will delete your old
                      token.
                    </Trans>
                  </div>
                  {token ? (
                    <div>
                      <CardBody>
                        <div className='pf-c-content'>
                          <Trans>
                            <b>WARNING</b> copy this token now. This is the only
                            time you will ever see it.
                          </Trans>
                        </div>
                      </CardBody>
                      <ClipboardCopy>{token}</ClipboardCopy>
                    </div>
                  ) : !token && !loadingToken ? (
                    <div className='load-token'>
                      <Button
                        onClick={() => this.loadToken()}
                      >{t`Load token`}</Button>
                    </div>
                  ) : (
                    <LoadingPageSpinner />
                  )}
                </CardBody>
              </section>
            </Card>
          )}
        </Main>
      </>
    );
  }

  private loadToken() {
    this.setState({ loadingToken: true }, () => {
      ActiveUserAPI.getToken()
        .then((result) =>
          this.setState({ token: result.data.token, loadingToken: false }),
        )
        .catch((e) => {
          const { status, statusText } = e.response;
          this.setState({
            alerts: [
              ...this.state.alerts,
              {
                variant: 'danger',
                title: t`Token could not be displayed.`,
                description: errorMessage(status, statusText),
              },
            ],
            loadingToken: false,
          });
        });
    });
  }

  private get closeAlert() {
    return closeAlertMixin('alerts');
  }
}

export default withRouter(TokenStandalone);
