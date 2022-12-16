import React, { useEffect, useReducer, useRef } from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import {
  CheckPagePermissions,
  LoadingIndicatorPage,
  useFocusWhenNavigate,
  useNotification,
  useOverlayBlocker,
} from "@strapi/helper-plugin";
import Check from "@strapi/icons/Check";
import { Box } from "@strapi/design-system/Box";
import { Flex } from "@strapi/design-system/Flex";
import { ToggleInput } from "@strapi/design-system/ToggleInput";
import { Typography } from "@strapi/design-system/Typography";
import { Button } from "@strapi/design-system/Button";
import { Main } from "@strapi/design-system/Main";
import { Stack } from "@strapi/design-system/Stack";
import { TextInput } from "@strapi/design-system/TextInput";
import { Link } from "@strapi/design-system/Link";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import { BaseHeaderLayout } from "@strapi/design-system";
import Trash from "@strapi/icons/Trash";
import Plus from "@strapi/icons/Plus";
import {
  ContentLayout,
  HeaderLayout,
  Layout,
} from "@strapi/design-system/Layout";
import axios from "axios";
import isEqual from "lodash/isEqual";
import { axiosInstance, getRequestUrl, getTrad } from "../../utils";
import init from "./init";
import ImageFormat from "./ImageFormat";
import reducer, { initialState } from "./reducer";
import pluginPermissions from "../../permissions";

export const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const { lockApp, unlockApp } = useOverlayBlocker();
  const toggleNotification = useNotification();
  useFocusWhenNavigate();

  const [
    { initialData, isLoading, isSubmiting, modifiedData, responsiveDimensions },
    dispatch,
  ] = useReducer(reducer, initialState, init);

  const isMounted = useRef(true);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const getData = async () => {
      try {
        const {
          data: { data },
        } = await axiosInstance.get(getRequestUrl("settings"), {
          cancelToken: source.token,
        });

        const {
          data: { data: uploadSettings },
        } = await axiosInstance.get("/upload/settings", {
          cancelToken: source.token,
        });

        dispatch({
          type: "GET_DATA_SUCCEEDED",
          data: {
            ...data,
            responsiveDimensions: uploadSettings.responsiveDimensions,
          },
        });
      } catch (err) {
        console.error(err);
      }
    };

    if (isMounted.current) {
      getData();
    }

    return () => {
      source.cancel("Operation canceled by the user.");
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSaveButtonDisabled = isEqual(initialData, modifiedData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSaveButtonDisabled) {
      return;
    }

    lockApp();

    dispatch({ type: "ON_SUBMIT" });

    try {
      await axiosInstance.put(getRequestUrl("settings"), modifiedData);

      dispatch({
        type: "SUBMIT_SUCCEEDED",
      });

      toggleNotification({
        type: "success",
        message: { id: "notification.form.success.fields" },
      });
    } catch (err) {
      console.error(err);

      try {
        toggleNotification({
          type: "warning",
          message: err.response.data.error.message || err.message,
        });
      } catch (error) {}

      dispatch({ type: "ON_SUBMIT_ERROR" });
    }

    unlockApp();
  };

  const handleChange = ({ target: { name, value } }) => {
    console.log("handleChange", name, value);
    dispatch({
      type: "ON_CHANGE",
      keys: name,
      value,
    });
  };

  const handleFormatsChange = ({ target: { name, value } }, index) => {
    dispatch({
      type: "ON_FORMATS_CHANGE",
      keys: name,
      value,
      index,
    });
  };

  const handleAddFormat = () => {
    dispatch({
      type: "ADD_FORMAT",
    });
  };

  const handleDeleteFormat = (index) => {
    dispatch({
      type: "DELETE_FORMAT",
      index,
    });
  };

  if (!responsiveDimensions) {
    return (
      <ContentLayout>
        <Box
          background="neutral0"
          padding={6}
          shadow="filterShadow"
          hasRadius
          style={{ textAlign: "center", marginTop: 50, fontSize: "1.2em" }}
        >
          <Typography variant="beta">
            {formatMessage(
              { id: getTrad("settings.section.toActivate.label") },
              {
                setting: formatMessage({
                  id: "upload.settings.form.responsiveDimensions.label",
                }),
                link: (str) => (
                  <Link to="/settings/media-library" key="settings-link">
                    {str}
                  </Link>
                ),
              }
            )}
          </Typography>
        </Box>
      </ContentLayout>
    );
  }

  return (
    <Main tabIndex={-1}>
      <Helmet
        title={formatMessage({
          id: getTrad("page.title"),
          defaultMessage: "Settings - Responsive Image",
        })}
      />
      <form onSubmit={handleSubmit}>
        <HeaderLayout
          title={formatMessage({
            id: getTrad("settings.header.label"),
            defaultMessage: "Responsive image",
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
                id: "app.components.Button.save",
                defaultMessage: "Save",
              })}
            </Button>
          }
          subtitle={formatMessage({
            id: getTrad("settings.sub-header.label"),
            defaultMessage: "Configure the settings for the responsive image",
          })}
        />
        <ContentLayout>
          {isLoading ? (
            <LoadingIndicatorPage />
          ) : (
            <Layout>
              <Stack spacing={12}>
                <Box
                  background="neutral0"
                  padding={6}
                  shadow="filterShadow"
                  hasRadius
                >
                  <Stack spacing={4}>
                    <Flex>
                      <Typography variant="delta" as="h2">
                        {formatMessage({
                          id: getTrad("settings.section.global.label"),
                        })}
                      </Typography>
                    </Flex>
                    <Grid gap={6}>
                      <GridItem col={6} s={12}>
                        <TextInput
                          label={formatMessage({
                            id: getTrad("settings.form.quality.label"),
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
                      </GridItem>
                      <GridItem col={6} s={12}>
                        <ToggleInput
                          checked={modifiedData.progressive}
                          label={formatMessage({
                            id: getTrad("settings.form.progressive.label"),
                          })}
                          name="progressive"
                          offLabel={formatMessage({
                            id: "app.components.ToggleCheckbox.off-label",
                            defaultMessage: "Off",
                          })}
                          onLabel={formatMessage({
                            id: "app.components.ToggleCheckbox.on-label",
                            defaultMessage: "On",
                          })}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                name: "progressive",
                                value: e.target.checked,
                              },
                            });
                          }}
                        />
                      </GridItem>
                    </Grid>
                  </Stack>
                </Box>
                <BaseHeaderLayout
                  primaryAction={
                    <Button startIcon={<Plus />} onClick={handleAddFormat}>
                      {formatMessage({
                        id: getTrad("settings.section.formats.add.label"),
                      })}
                    </Button>
                  }
                  title={formatMessage({
                    id: getTrad("settings.section.formats.label"),
                  })}
                  as="h2"
                  style={{
                    margin: "0 -56px 0 -56px",
                  }}
                />
                {modifiedData.formats.map((input, index) => (
                  <Box
                    key={index}
                    background="neutral0"
                    padding={6}
                    shadow="filterShadow"
                    hasRadius
                    style={{ marginTop: 30 }}
                  >
                    <ImageFormat
                      className="row"
                      format={input}
                      handleFormatsChange={handleFormatsChange}
                      index={index}
                    />
                    <Button
                      variant="danger"
                      startIcon={<Trash />}
                      onClick={() => handleDeleteFormat(index)}
                      style={{
                        marginTop: 25,
                      }}
                    >
                      {formatMessage({
                        id: getTrad("settings.section.formats.delete.label"),
                      })}
                    </Button>
                  </Box>
                ))}
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
