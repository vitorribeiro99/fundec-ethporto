// React
import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// Soft UI Dashboard PRO React components
import SuiBox from "components/atoms/SoftBox";
import SoftEditor from "components/atoms/SoftEditor";
import SelectDefault from "components/molecules/InputFields/SelectDefault";
import InputDefault from "components/molecules/InputFields/InputDefault";
import DatePickerDefault from "components/molecules/InputFields/DatePickerDefault";
import SwitchDefault from "components/molecules/InputFields/SwitchDefault";
import EditorDefault from "components/molecules/InputFields/EditorDefault";

// Others
import { assets } from "constants/assets.js";

function NewCampaign({
  setName,
  setDescription,
  setActivationDate,
  setExpirationDate,
  setIsDemo,
  isDemo,
  setAsset,
  setGoal,
  setApy,
  setOwnerAddress,
}) {
  const onNameChange = (name) => setName(name);
  const onDescriptionChange = (description) => setDescription(description);
  const onActivationDateChange = (date) => setActivationDate(date[0]);
  const onExpirationDateChange = (date) => setExpirationDate(date[0]);
  const onIsDemoChange = () => setIsDemo(!isDemo);
  const onAssetChange = (e) => setAsset(e.value);
  const onGoalChange = (e) => setGoal(e.target.value);
  const onApyChange = (e) => setApy(e.target.value);
  const onOwnerAddressChange = (e) => setOwnerAddress(e.target.value);

  return (
    <SuiBox mt={0} mb={4}>
      <Typography id="modal-modal-title" variant="h4" component="h4">
        New Campaign
      </Typography>
      <Grid container spacing={0} alignContent={"center"} mt={1}>
        <Grid item xs={12}>
          <InputDefault type="text" label="Name" defaultValue={""} onChange={onNameChange} />
        </Grid>
        <Grid item xs={12}>
          <EditorDefault
            label="Description"
            subLabel="This is how others will learn about the campaign, so make it good!"
            onChange={onDescriptionChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <DatePickerDefault
                label="Começa em"
                onChange={onActivationDateChange}
                defaultValue={new Date()}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePickerDefault
                label="Termina em"
                onChange={onExpirationDateChange}
                defaultValue={new Date()}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <SwitchDefault label="Is demo?" onChange={onIsDemoChange} defaultChecked={isDemo} />
        </Grid>

        {isDemo ? (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <SelectDefault
                  label="Ativo"
                  defaultValue={{ value: "", label: "" }}
                  onChange={onAssetChange}
                  options={assets}
                />
              </Grid>
              <Grid item xs={4}>
                <InputDefault
                  type="number"
                  label="Objetivo"
                  defaultValue={0}
                  onChange={onGoalChange}
                />
              </Grid>
              <Grid item xs={4}>
                <InputDefault type="number" label="APY" defaultValue={0} onChange={onApyChange} />
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <SuiBox mt={2} mb={2} textAlign="center">
              <h6
                style={{
                  fontSize: ".7em",
                  color: "red",
                  textAlign: "center",
                  fontWeight: 400,
                  transition: ".2s all",
                }}
              >
                {"Not Available"}
              </h6>
            </SuiBox>
          </Grid>
        )}
      </Grid>
    </SuiBox>
  );
}

export default NewCampaign;
