import { Trans, t } from '@lingui/macro';
import {
  ActionGroup,
  Button,
  Divider,
  Form,
  FormGroup,
  InputGroup,
  Spinner,
  TextInput,
  Title,
} from '@patternfly/react-core';
import React, { Component } from 'react';
import { PermissionCategories } from 'src/components';

interface IState {
  permissions: string[];
}

interface IProps {
  nameDisabled?: boolean;
  name: string;
  description: string;
  onNameChange?: (value: string) => void;
  nameValidated?: 'default' | 'warning' | 'success' | 'error';
  nameHelperText?: string;
  descriptionValidated: 'default' | 'warning' | 'success' | 'error';
  descriptionHelperText: string;
  onDescriptionChange: (value: string) => void;
  saveRole: (permissions: string[]) => void;
  cancelRole: () => void;
  isSavingDisabled: boolean;
  saving: boolean;
  originalPermissions?: string[];
}

export class RoleForm extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      permissions: [],
    };
  }

  componentDidMount() {
    if (this.props.originalPermissions) {
      this.setState({ permissions: this.props.originalPermissions });
    }
  }

  render() {
    const { permissions } = this.state;
    const {
      name,
      onNameChange,
      nameValidated,
      nameHelperText,
      description,
      descriptionValidated,
      descriptionHelperText,
      onDescriptionChange,
      saveRole,
      cancelRole,
      nameDisabled,
      isSavingDisabled,
      saving,
    } = this.props;

    return (
      <>
        <Form>
          <div>
            <div style={{ paddingBottom: '8px' }}>
              <Title headingLevel='h2'>{t`Details`}</Title>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <FormGroup
                isRequired
                key='name'
                fieldId='name'
                label={t`Name`}
                style={{ width: '50%', float: 'left' }}
                helperTextInvalid={nameHelperText}
                validated={nameValidated}
              >
                <InputGroup>
                  <TextInput
                    id='role_name'
                    isDisabled={nameDisabled}
                    value={name}
                    onChange={onNameChange}
                    type='text'
                    validated={nameValidated}
                    placeholder={t`Role name`}
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup
                isRequired
                style={{ width: '50%' }}
                key='description'
                fieldId='description'
                label={t`Description`}
                helperTextInvalid={descriptionHelperText}
                validated={descriptionValidated}
              >
                <TextInput
                  id='role_description'
                  value={description}
                  onChange={onDescriptionChange}
                  type='text'
                  validated={descriptionValidated}
                  placeholder={t`Add a role description here`}
                />
              </FormGroup>
            </div>
          </div>
          <div>
            <br />
            <Divider />
            <br />
            <Title headingLevel='h2'>
              <Trans>Permissions</Trans>
            </Title>

            <PermissionCategories
              permissions={permissions}
              setSelected={(permissions) => this.setState({ permissions })}
              showEmpty
            />
          </div>

          <ActionGroup>
            <Button
              variant='primary'
              isDisabled={isSavingDisabled}
              onClick={() => saveRole(permissions)}
            >
              {t`Save`}
            </Button>

            <Button
              variant='secondary'
              onClick={cancelRole}
            >{t`Cancel`}</Button>
            {saving ? <Spinner /> : null}
          </ActionGroup>
        </Form>
      </>
    );
  }
}
