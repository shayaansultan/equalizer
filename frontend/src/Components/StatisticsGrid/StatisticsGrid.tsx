import React from "react";
import { Box, Divider, Grid, Typography, Card } from "@mui/material";

export const StatisticsGrid = () => {
    return( 
    <>
    <Card sx={{ flexGrow: 5, fontSize: 400, marginY: 4, width: '120%' }}>
      <Grid container spacing={2} sx={{textAlign: 'center', justifyContent: 'space-between', paddingY: 5, boxShadow: 10}}>
        <Grid item xs={3}>
          <Typography variant="h4" paddingX={5} sx={{ fontWeight: 'bold' }}>Annual Salary</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h4" paddingX={5} sx={{ fontWeight: 'bold' }}>Credit Score</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h4" paddingX={5} sx={{ fontWeight: 'bold' }}>Monthly Spending</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h4" paddingX={5} sx={{ fontWeight: 'bold' }}>Outstanding Debts</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h4" paddingX={5}>$30,000</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant="h4" paddingX={5}>570</Typography>

        </Grid>
        <Grid item xs={3}>
        <Typography variant="h4" paddingX={5}>$2,600</Typography>

        </Grid>
        <Grid item xs={3}>
        <Typography variant="h4" paddingX={5}>$10,000</Typography>

        </Grid>
      </Grid>
    </Card>
    </>)
}
