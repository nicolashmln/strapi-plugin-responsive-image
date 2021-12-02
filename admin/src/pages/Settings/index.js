import React, { useEffect, useReducer, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import {
  CheckPagePermissions,
  LoadingIndicatorPage,
  useFocusWhenNavigate,
  useNotification,
  useOverlayBlocker,
} from '@strapi/helper-plugin';
import Check from '@strapi/icons/Check';
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { ToggleInput } from '@strapi/design-system/ToggleInput';
import { Typography } from '@strapi/design-system/Typography';
import { Button } from '@strapi/design-system/Button';
import { Main } from '@strapi/design-system/Main';
import { Stack } from '@strapi/design-system/Stack';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { ContentLayout, HeaderLayout, Layout } from '@strapi/design-system/Layout';
import axios from 'axios';
import isEqual from 'lodash/isEqual';
import { axiosInstance, getRequestUrl, getTrad } from '../../utils';
import init from './init';
import reducer, { initialState } from './reducer';
import pluginPermissions from '../../permissions';

export const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const { lockApp, unlockApp } = useOverlayBlocker();
  const toggleNotification = useNotification();
  useFocusWhenNavigate();

  const [{ initialData, isLoading, isSubmiting, modifiedData }, dispatch] = useReducer(
    reducer,
    initialState,
    init
  );

  const isMounted = useRef(true);

  // useEffect(() => {
  //   const CancelToken = axios.CancelToken;
  //   const source = CancelToken.source();

  //   const getData = async () => {
  //     try {
  //       const {
  //         data: { data },
  //       } = await axiosInstance.get(getRequestUrl('settings'), {
  //         cancelToken: source.token,
  //       });

  //       dispatch({
  //         type: 'GET_DATA_SUCCEEDED',
  //         data,
  //       });
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   if (isMounted.current) {
  //     getData();
  //   }

  //   return () => {
  //     source.cancel('Operation canceled by the user.');
  //     isMounted.current = false;
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const isSaveButtonDisabled = isEqual(initialData, modifiedData);

  const handleSubmit = async e => {
    e.preventDefault();

    // if (isSaveButtonDisabled) {
    //   return;
    // }

    // lockApp();

    // dispatch({ type: 'ON_SUBMIT' });

    // try {
    //   await axiosInstance.put(getRequestUrl('settings'), modifiedData);

    //   dispatch({
    //     type: 'SUBMIT_SUCCEEDED',
    //   });

    //   toggleNotification({
    //     type: 'success',
    //     message: { id: 'notification.form.success.fields' },
    //   });
    // } catch (err) {
    //   console.error(err);

    //   dispatch({ type: 'ON_SUBMIT_ERROR' });
    // }

    // unlockApp();
  };

  // const handleChange = ({ target: { name, value } }) => {
  //   dispatch({
  //     type: 'ON_CHANGE',
  //     keys: name,
  //     value,
  //   });
  // };

  return (
    <Main tabIndex={-1}>
      <Helmet
        title={formatMessage({
          id: getTrad('page.title'),
          defaultMessage: 'Settings - Responsive Image',
        })}
      />
      <form onSubmit={handleSubmit}>
        <HeaderLayout
          title={formatMessage({
            id: getTrad('settings.header.label'),
            defaultMessage: 'Responsive image - Settings',
          })}
          primaryAction={
            <Button
              disabled={isSaveButtonDisabled}
              data-testid="save-button"
              loading={isSubmiting}
              type="submit"
              startIcon={<Check />}
              size="L"
            >
              {formatMessage({
                id: 'app.components.Button.save',
                defaultMessage: 'Save',
              })}
            </Button>
          }
          subtitle={formatMessage({
            id: getTrad('settings.sub-header.label'),
            defaultMessage: 'Configure the settings for the media library',
          })}
        />
        <ContentLayout>
          {isLoading ? (
            <LoadingIndicatorPage />
          ) : (
            <Layout>
              <Stack size={12}>
                <Box background="neutral0" padding={6} shadow="filterShadow" hasRadius>
                  Test
                </Box>
              </Stack>
            </Layout>
          )}
        </ContentLayout>
      </form>
    </Main>
  );
};

const ProtectedSettingsPage = () => (
  <CheckPagePermissions permissions={pluginPermissions.settings}>
    <SettingsPage />
  </CheckPagePermissions>
);

export default ProtectedSettingsPage;