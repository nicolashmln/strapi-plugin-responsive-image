import React, { useEffect, useRef } from 'react';
import { useGlobalContext } from 'strapi-helper-plugin';
import { Inputs } from '@buffetjs/custom';
import { getTrad } from '../../utils';

const ImageFormat = (props) => {
  const { formatMessage } = useGlobalContext();

  const inputName = useRef(null);

  const fitList = ['cover', 'contain', 'fill', 'inside', 'outside'];
  const positionList = ['centre', 'center', 'north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest']
  const convertToFormatList = ['', 'jpeg', 'png', 'webp']

  const input = props.format;
  const handleFormatsChange = props.handleFormatsChange;
  const index = props.index;

  useEffect(() => {
    // If the name is empty it means we added a new one
    if (input.name === '') {
      document.getElementById(`responsive-image-name-${index}`).focus(); 
    }
  });

  return (
    <div className="responsive-image-format row">
      <div className="col-6">
        <Inputs
          // ref={inputName} // Ref doesn't work: Function components cannot be given refs. Attempts to access this ref will fail.
          id={`responsive-image-name-${index}`}
          label={formatMessage({
            id: getTrad('settings.form.formats.name.label'),
          })}
          description={formatMessage({
            id: getTrad('settings.form.formats.name.description'),
          })}
          validations={{
            required: true
          }}
          name="name"
          onChange={(target) => handleFormatsChange(target, index)}
          type="text"
          value={input.name}
        />
      </div>
      <div className="col-3">
        <Inputs
          label={formatMessage({
            id: getTrad('settings.form.formats.x2.label'),
          })}
          description={`${input.width*2}px`}
          name="x2"
          onChange={(target) => handleFormatsChange(target, index)}
          type="bool"
          value={input.x2}
        />
      </div>
      <div className="col-3">
        <Inputs
          label={formatMessage({
            id: getTrad('settings.form.formats.convertToFormat.label'),
          })}
          description={formatMessage({
            id: getTrad('settings.form.formats.convertToFormat.description'),
          })}
          name="convertToFormat"
          onChange={(target) => handleFormatsChange(target, index)}
          type="select"
          options={convertToFormatList}
          value={input.convertToFormat}
        />
      </div>
      <div className="col-6">
        <Inputs
          label={formatMessage({
            id: getTrad('settings.form.formats.width.label'),
          })}
          name="width"
          validations={{
            min: 1,
          }}
          onChange={(target) => handleFormatsChange(target, index)}
          type="number"
          value={input.width}
        />
      </div>
      <div className="col-6">
        <Inputs
          label={formatMessage({
            id: getTrad('settings.form.formats.height.label'),
          })}
          name="height"
          onChange={(target) => handleFormatsChange(target, index)}
          type="number"
          value={input.height}
        />
      </div>
      <div className="col-4">
        <Inputs
          label={formatMessage({
            id: getTrad('settings.form.formats.fit.label'),
          })}
          description={formatMessage({
            id: getTrad('settings.form.formats.fit.description'),
          })}
          name="fit"
          onChange={(target) => handleFormatsChange(target, index)}
          type="select"
          options={fitList}
          value={input.fit}
        />
      </div>
      <div className="col-4">
        <Inputs
          label={formatMessage({
            id: getTrad('settings.form.formats.position.label'),
          })}
          description={formatMessage({
            id: getTrad('settings.form.formats.position.description'),
          })}
          name="position"
          onChange={(target) => handleFormatsChange(target, index)}
          type="select"
          options={positionList}
          value={input.position}
        />
      </div>
      <div className="col-4">
        <Inputs
          label={formatMessage({
            id: getTrad('settings.form.formats.withoutEnlargement.label'),
          })}
          description={formatMessage({
            id: getTrad('settings.form.formats.withoutEnlargement.description'),
          })}
          name="withoutEnlargement"
          onChange={(target) => handleFormatsChange(target, index)}
          type="bool"
          value={input.withoutEnlargement}
        />
      </div>
    </div>
  );
};

export default ImageFormat;
