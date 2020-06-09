import React, { useEffect, useReducer, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@buffetjs/core';
import { Header, Inputs } from '@buffetjs/custom';
import { Plus, Remove } from '@buffetjs/icons';
import { isEqual } from 'lodash';
import { LoadingIndicatorPage, useGlobalContext, request } from 'strapi-helper-plugin';

import { getRequestUrl, getTrad } from '../../utils';
import Text from '../../components/Text';
import SectionTitleWrapper from './SectionTitleWrapper';
import Wrapper from './Wrapper';
import ImageFormat from './ImageFormat';
import init from './init';
import reducer, { initialState } from './reducer';

// TODO better UX like webhooks https://github.com/strapi/strapi/blob/master/packages/strapi-admin/admin/src/containers/Webhooks/ListView/index.js

const SettingsPage = () => {
  const { formatMessage } = useGlobalContext();
  const [reducerState, dispatch] = useReducer(reducer, initialState, init);
  const { initialData, isLoading, modifiedData, responsiveDimensions } = reducerState.toJS();
  const isMounted = useRef(true);
  const getDataRef = useRef();
  const abortController = new AbortController();

  getDataRef.current = async () => {
    try {
      const { signal } = abortController;
      const { data } = await request(getRequestUrl('settings', { method: 'GET', signal }));

      const { data: uploadSettings } = await request('/upload/settings', { method: 'GET', signal });

      if (isMounted.current) {
        dispatch({
          type: 'GET_DATA_SUCCEEDED',
          data: {
            ...data,
            responsiveDimensions: uploadSettings.responsiveDimensions
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDataRef.current();

    return () => {
      abortController.abort();
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    try {
      await request(getRequestUrl('settings'), {
        method: 'PUT',
        body: modifiedData,
      });

      if (isMounted.current) {
        dispatch({
          type: 'SUBMIT_SUCCEEDED',
        });
      }

      strapi.notification.success('notification.form.success.fields');
    } catch (err) {
      console.error(err);
      strapi.notification.error(getTrad('settings.error'));
    }
  };

  const headerProps = {
    title: {
      label: formatMessage({ id: getTrad('settings.header.label') }),
    },
    content: formatMessage({
      id: getTrad('settings.sub-header.label'),
    }),
    actions: [
      {
        color: 'cancel',
        disabled: isEqual(initialData, modifiedData),
        // TradId from the strapi-admin package
        label: formatMessage({ id: 'app.components.Button.cancel' }),
        onClick: () => {
          dispatch({
            type: 'CANCEL_CHANGES',
          });
        },
        type: 'button',
      },
      {
        disabled: false,
        color: 'success',
        // TradId from the strapi-admin package
        label: formatMessage({ id: 'app.components.Button.save' }),
        onClick: handleSubmit,
        type: 'button',
      },
    ],
  };

  const handleChange = ({ target: { name, value } }) => {
    dispatch({
      type: 'ON_CHANGE',
      keys: name,
      value,
    });
  };

  const handleFormatsChange = ({ target: { name, value } }, index) => {
    dispatch({
      type: 'ON_FORMATS_CHANGE',
      keys: name,
      value,
      index,
    });
  };

  const handleAddFormat = () => {
    dispatch({
      type: 'ADD_FORMAT',
    });
  };

  const handleDeleteFormat = (index) => {
    dispatch({
      type: 'DELETE_FORMAT',
      index
    });
  };

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  if (!responsiveDimensions) {
    return (
      <div style={{textAlign: 'center', marginTop: 50, fontSize: '1.2em'}}>
        {formatMessage({ id: getTrad('settings.section.toActivate.label') }, {
          setting: formatMessage({ id: 'upload.settings.form.responsiveDimensions.label' }),
          link: str => <Link to="/settings/media-library" key="settings-link">{str}</Link>
        })}
      </div>
    );
  }

  return (
    <>
      <Header {...headerProps} />
      <Wrapper>
        <div className="container-fluid">
          <div className="row">
            <SectionTitleWrapper className="col-12">
              <Text fontSize="xs" fontWeight="semiBold" color="#787E8F">
                {formatMessage({ id: getTrad('settings.section.global.label') })}
              </Text>
            </SectionTitleWrapper>
            <div className="col-6">
              <Inputs
                label={formatMessage({
                  id: getTrad('settings.form.quality.label'),
                })}
                name="quality"
                onChange={handleChange}
                type="number"
                validations={{
                  min: 1,
                  max: 100,
                }}
                value={modifiedData.quality}
              />
            </div>
            <div className="col-6">
              <Inputs
                label={formatMessage({
                  id: getTrad('settings.form.progressive.label'),
                })}
                name="progressive"
                onChange={handleChange}
                type="bool"
                value={modifiedData.progressive}
              />
            </div>
          </div>
        </div>
      </Wrapper>
      <div style={{marginTop: 35, paddingBottom: 40}}>
        <Header
          actions={[
            {
              label: formatMessage({ id: getTrad('settings.section.formats.add.label') }),
              onClick: handleAddFormat,
              color: 'primary',
              type: 'submit',
              icon: <Plus fill="#fff" width="11px" height="11px" />,
            },
          ]}
          title={{
            label: formatMessage({ id: getTrad('settings.section.formats.label') }),
          }}
        />
        {modifiedData.formats.map((input, index) => (
          <Wrapper key={index}>
            <div className="container-fluid">
              <ImageFormat className="row" format={input} handleFormatsChange={handleFormatsChange} index={index} />
              <Button color="delete" label={formatMessage({ id: getTrad('settings.section.formats.delete.label') })} icon={<Remove fill="#fff" width="11px" height="11px" />} onClick={() => handleDeleteFormat(index)} />
            </div>
          </Wrapper>
        ))}
      </div>
    </>
  );
};

export default SettingsPage;
