import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { BirthdayInput,
  BirthdayPerson,}from "../../../types/types";
import {
 
  createBirthday,
  deleteBirthday,
  getBirthdays,
  getTodayBirthdays,
  updateBirthday,
} from "../../../api/birthdayApi";
import BirthdayActions from "./BirthdayActions";
import BirthdayDisplay from "./BirthdayDisplay";

interface BirthdayBoardProps {
  user: {
    id: number;
    email: string;
  } | null;
  onLogout: () => void;
}

const emptyForm: BirthdayInput = {
  firstName: "",
  lastName: "",
  birthDate: "",
};

const BirthdayBoard = ({ user, onLogout }: BirthdayBoardProps) => {
  const [todayBirthdays, setTodayBirthdays] = useState<BirthdayPerson[]>([]);
  const [people, setPeople] = useState<BirthdayPerson[]>([]);

  const [form, setForm] = useState<BirthdayInput>(emptyForm);
  const [editingPersonId, setEditingPersonId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [loading, setLoading] = useState(false);
  const [todayLoading, setTodayLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTodayBirthdays = useCallback(async () => {
    setTodayLoading(true);

    try {
      const todayResult = await getTodayBirthdays();
      setTodayBirthdays(todayResult.people);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load today's birthdays"
      );
    } finally {
      setTodayLoading(false);
    }
  }, []);

  const loadBirthdays = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const birthdaysResult = await getBirthdays(page, limit);

      setPeople(birthdaysResult.people);
      setTotalPages(Math.max(birthdaysResult.pagination.totalPages || 1, 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load birthdays");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadTodayBirthdays();
  }, [loadTodayBirthdays]);

  useEffect(() => {
    loadBirthdays();
  }, [loadBirthdays]);

  const refreshAfterChange = async () => {
    await Promise.all([loadTodayBirthdays(), loadBirthdays()]);
  };

  const handleChange = (field: keyof BirthdayInput, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingPersonId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const wasEditing = editingPersonId !== null;

      if (editingPersonId) {
        await updateBirthday(editingPersonId, form);
      } else {
        await createBirthday(form);
      }

      resetForm();

      if (!wasEditing && page !== 1) {
        setPage(1);
        await loadTodayBirthdays();
      } else {
        await refreshAfterChange();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save birthday");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (person: BirthdayPerson) => {
    setEditingPersonId(person.id);

    setForm({
      firstName: person.firstName,
      lastName: person.lastName,
      birthDate: person.birthDate.slice(0, 10),
    });
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this birthday?"
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteBirthday(id);

      if (people.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
        await loadTodayBirthdays();
      } else {
        await refreshAfterChange();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete birthday");
    }
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString();
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f6fa", py: 4 }}>
      <Container maxWidth="lg">
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  Birthday Board
                </Typography>

                <Typography color="text.secondary">
                  Welcome{user?.email ? `, ${user.email}` : ""}
                </Typography>
              </Box>

              <Button variant="outlined" color="inherit" onClick={onLogout}>
                Logout
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <BirthdayActions
              form={form}
              editingPersonId={editingPersonId}
              saving={saving}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />

            <BirthdayDisplay
              todayBirthdays={todayBirthdays}
              people={people}
              loading={loading}
              todayLoading={todayLoading}
              page={page}
              totalPages={totalPages}
              formatDate={formatDate}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default BirthdayBoard;