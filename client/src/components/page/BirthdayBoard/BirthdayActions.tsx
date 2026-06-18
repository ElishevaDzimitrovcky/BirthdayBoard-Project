import { Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { BirthdayInput } from "../../../types/types";

interface BirthdayActionsProps {
  form: BirthdayInput;
  editingPersonId: number | null;
  saving: boolean;
  onChange: (field: keyof BirthdayInput, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const BirthdayActions = ({
  form,
  editingPersonId,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: BirthdayActionsProps) => {
  return (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 600, mb: 2 }}
        >
          {editingPersonId ? "Edit Birthday" : "Add Birthday"}
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <TextField
              label="First name"
              value={form.firstName}
              onChange={(event) => onChange("firstName", event.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Last name"
              value={form.lastName}
              onChange={(event) => onChange("lastName", event.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Birth date"
              type="date"
              value={form.birthDate}
              onChange={(event) => onChange("birthDate", event.target.value)}
              required
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving
                ? "Saving..."
                : editingPersonId
                  ? "Save changes"
                  : "Add birthday"}
            </Button>

            {editingPersonId && (
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BirthdayActions;