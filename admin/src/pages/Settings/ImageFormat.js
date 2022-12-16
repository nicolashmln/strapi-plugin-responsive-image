import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { TextInput } from "@strapi/design-system";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import { ToggleInput } from "@strapi/design-system/ToggleInput";
import { Select, Option } from "@strapi/design-system";
import { getTrad } from "../../utils";

const ImageFormat = (props) => {
  const { formatMessage } = useIntl();

  const inputName = useRef(null);

  const fitList = ["cover", "contain", "fill", "inside", "outside"];
  const positionList = [
    "centre",
    "center",
    "north",
    "northeast",
    "east",
    "southeast",
    "south",
    "southwest",
    "west",
    "northwest",
  ];
  const convertToFormatList = [
    { value: "", label: "Same as source" },
    { value: "jpg", label: "JPEG" },
    { value: "png", label: "PNG" },
    { value: "webp", label: "WebP" },
    { value: "avif", label: "AVIF" },
  ];

  const input = props.format;
  const handleFormatsChange = props.handleFormatsChange;
  const index = props.index;

  useEffect(() => {
    // If the name is empty it means we added a new one
    if (input.name === "") {
      document.getElementById(`responsive-image-name-${index}`).focus();
    }
  });

  return (
    <Grid gap={6}>
      <GridItem col={6} s={12}>
        <TextInput
          // ref={inputName} // Ref doesn't work: Function components cannot be given refs. Attempts to access this ref will fail.
          id={`responsive-image-name-${index}`}
          label={formatMessage({
            id: getTrad("settings.form.formats.name.label"),
          })}
          hint={formatMessage({
            id: getTrad("settings.form.formats.name.description"),
          })}
          validations={{
            required: true,
          }}
          name="name"
          onChange={(target) => handleFormatsChange(target, index)}
          type="text"
          value={input.name}
        />
      </GridItem>
      <GridItem col={3} s={6}>
        <ToggleInput
          checked={input.x2}
          label={formatMessage({
            id: getTrad("settings.form.formats.x2.label"),
          })}
          name="x2"
          offLabel={formatMessage({
            id: "app.components.ToggleCheckbox.off-label",
            defaultMessage: "Off",
          })}
          onLabel={formatMessage({
            id: "app.components.ToggleCheckbox.on-label",
            defaultMessage: "On",
          })}
          hint={`${input.width * 2}px`}
          onChange={(e) => {
            handleFormatsChange({
              target: {
                name: "x2",
                value: e.target.checked,
              },
            });
          }}
        />
      </GridItem>
      <GridItem col={3} s={6}>
        <Select
          label={formatMessage({
            id: getTrad("settings.form.formats.convertToFormat.label"),
          })}
          hint={formatMessage({
            id: getTrad("settings.form.formats.convertToFormat.description"),
          })}
          name="convertToFormat"
          value={input.convertToFormat}
          selectButtonTitle="Carret Down Button"
          onChange={(target) => handleFormatsChange(target, index)}
        >
          {convertToFormatList.map((format) => (
            <Option value={format.value}>{format.label}</Option>
          ))}
        </Select>
      </GridItem>
      <GridItem col={6} s={12}>
        <TextInput
          label={formatMessage({
            id: getTrad("settings.form.formats.width.label"),
          })}
          name="width"
          validations={{
            min: 1,
          }}
          onChange={(target) => handleFormatsChange(target, index)}
          type="number"
          value={input.width}
        />
      </GridItem>
      <GridItem col={6} s={12}>
        <TextInput
          label={formatMessage({
            id: getTrad("settings.form.formats.height.label"),
          })}
          name="height"
          onChange={(target) => handleFormatsChange(target, index)}
          type="number"
          value={input.height}
        />
      </GridItem>
      <GridItem col={4} s={7}>
        <Select
          label={formatMessage({
            id: getTrad("settings.form.formats.fit.label"),
          })}
          hint={formatMessage({
            id: getTrad("settings.form.formats.fit.description"),
          })}
          name="fit"
          value={input.fit}
          selectButtonTitle="Carret Down Button"
          onChange={(target) => handleFormatsChange(target, index)}
        >
          {fitList.map((fit) => (
            <Option value={fit}>{fit}</Option>
          ))}
        </Select>
      </GridItem>
      <GridItem col={4} s={7}>
        <Select
          label={formatMessage({
            id: getTrad("settings.form.formats.position.label"),
          })}
          hint={formatMessage({
            id: getTrad("settings.form.formats.position.description"),
          })}
          name="position"
          value={input.position}
          selectButtonTitle="Carret Down Button"
          onChange={(target) => handleFormatsChange(target, index)}
        >
          {positionList.map((position) => (
            <Option value={position}>{position}</Option>
          ))}
        </Select>
      </GridItem>
      <GridItem col={4} s={7}>
        <ToggleInput
          checked={input.withoutEnlargement}
          label={formatMessage({
            id: getTrad("settings.form.formats.withoutEnlargement.label"),
          })}
          hint={formatMessage({
            id: getTrad("settings.form.formats.withoutEnlargement.description"),
          })}
          name="withoutEnlargement"
          offLabel={formatMessage({
            id: "app.components.ToggleCheckbox.off-label",
            defaultMessage: "Off",
          })}
          onLabel={formatMessage({
            id: "app.components.ToggleCheckbox.on-label",
            defaultMessage: "On",
          })}
          onChange={(e) => {
            handleFormatsChange({
              target: {
                name: "withoutEnlargement",
                value: e.target.checked,
              },
            });
          }}
        />
      </GridItem>
    </Grid>
  );
};

export default ImageFormat;
