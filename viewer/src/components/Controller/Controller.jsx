import React from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';

import { AxisSliders } from './AxisSliders';
import { ChannelControllers } from './ChannelControllers';
import { OpacitySlider } from './OpacitySlider';

export const Controller = ({
  sourceData,
  layerStates,
  isLabel,
  resetViewState,
  toggleVisibility,
  setLayerOpacity,
  setLayerSelections,
  toggleChannelVisibility,
  setChannelContrast,
  copyLink,
}) => {
  const [hiddenMenu, toggleMenuView] = React.useReducer((v) => !v, false);
  const controls = layerStates.map((layerState, index) => {
    if (!layerState || hiddenMenu) {
      return null;
    }

    const lowest_level = sourceData[index]?.loader[0].shape, levels = sourceData[index]?.loader.length;
    return (
      <React.Fragment key={layerState.layerProps.id}>
        <h3 style={{color: "red", marginBottom: "0px", marginTop: "20px"}}>
            Source {index} </h3>
        <p> layers = {levels} <br/> deepest size = {lowest_level[lowest_level.length - 1]} * {lowest_level[lowest_level.length - 2]}</p>
        {!isLabel[index] && (
          <>
            <FormControlLabel
              key={layerState.layerProps.id}
              label={layerState.layerProps.id}
              control={
                <Checkbox
                  label={layerState.id}
                  checked={layerState.on}
                  icon={<VisibilityOffIcon />}
                  checkedIcon={<VisibilityIcon />}
                  onChange={() => toggleVisibility(index)}
                />
              }
            />
            <AxisSliders
              {...sourceData[index]}
              selections={layerState.layerProps.selections}
              onChange={(selections) => setLayerSelections(index, selections)}
            />
            <OpacitySlider
              value={layerState.layerProps.opacity}
              onChange={(e, value) => setLayerOpacity(index, null, value)}
            />
            <Divider>Channels</Divider>
            <ChannelControllers
              {...sourceData[index]}
              {...layerState}
              toggleChannelVisibility={(i) => toggleChannelVisibility(index, i)}
              setChannelContrast={(i, contrast) =>
                setChannelContrast(index, i, contrast)
              }
            />
          </>
        )}
        {layerState.labels?.length && <Divider>Labels</Divider>}
        {layerState.labels?.map((label, i) => {
          // if standalone label visibility is from image layer
          const { id, on } = isLabel[index]
            ? {
                id: null,
                on: layerState.on,
              }
            : {
                id: label.layerProps.id,
                on: label.on,
              };
          return (
            <React.Fragment key={label.layerProps.id}>
              {i > 0 && <Divider />}
              <FormControlLabel
                key={label.layerProps.id}
                label={`${sourceData[index].labels[i].name ? sourceData[index].labels[i].name : label.layerProps.id + " (label)"}`}
                control={
                  <Checkbox
                    label={label.layerProps.id}
                    checked={on}
                    icon={<VisibilityOffIcon />}
                    checkedIcon={<VisibilityIcon />}
                    onChange={() => toggleVisibility(index, id)}
                  />
                }
              />
              <OpacitySlider
                value={label.layerProps.opacity}
                onChange={(_e, value) =>
                  setLayerOpacity(index, label.layerProps.id, value)
                }
              />
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  });

  return (
    <div className="viewer-controller">
      <Stack spacing={2}>
        <FormGroup>{controls}</FormGroup>
        <button type="button" className="btn" onClick={resetViewState}>
          Reset view
        </button>
        <button type="button" className="btn" onClick={copyLink}>
          Copy link with current view
        </button>
        <button type="button" className="btn" onClick={toggleMenuView}>
          {hiddenMenu ? "Show" : "Hide"} menu
        </button>
      </Stack>
    </div>
  );
};
