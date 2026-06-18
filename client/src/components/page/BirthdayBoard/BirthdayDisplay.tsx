import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { BirthdayPerson } from "../../../types/types";

interface BirthdayDisplayProps {
  todayBirthdays: BirthdayPerson[];
  people: BirthdayPerson[];
  loading: boolean;
  todayLoading: boolean;
  page: number;
  totalPages: number;
  formatDate: (date: string) => string;
  onEdit: (person: BirthdayPerson) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
}

const BirthdayDisplay = ({
  todayBirthdays,
  people,
  loading,
  todayLoading,
  page,
  totalPages,
  formatDate,
  onEdit,
  onDelete,
  onPageChange,
}: BirthdayDisplayProps) => {
  return (
    <>
      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 2,
            }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Today's Birthdays
            </Typography>

            <Chip
              label={`${todayBirthdays.length} today`}
              color={todayBirthdays.length > 0 ? "primary" : "default"}
            />
          </Box>

          {todayLoading  ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} />
              <Typography>Loading...</Typography>
            </Box>
          ) : todayBirthdays.length === 0 ? (
            <Typography color="text.secondary">No birthdays today.</Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {todayBirthdays.map((person) => (
                <Paper
                  key={person.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }}>
                    {person.firstName} {person.lastName}
                  </Typography>

                  <Typography color="text.secondary">
                    {formatDate(person.birthDate)}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 2,
            }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              All Birthdays
            </Typography>

            <Typography color="text.secondary">
              Page {page} of {totalPages}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} />
              <Typography>Loading...</Typography>
            </Box>
          ) : people.length === 0 ? (
            <Typography color="text.secondary">
              No birthdays added yet.
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>First name</TableCell>
                    <TableCell>Last name</TableCell>
                    <TableCell>Birth date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {people.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>{person.firstName}</TableCell>
                      <TableCell>{person.lastName}</TableCell>
                      <TableCell>{formatDate(person.birthDate)}</TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => onEdit(person)}
                          >
                            Edit
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => onDelete(person.id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => onPageChange(value)}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default BirthdayDisplay;