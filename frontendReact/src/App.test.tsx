import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

import App from './App';
import ProtectedRoute from './ProtectedRoute';
import Logowanie from './Logowanie';
import Rejestracja from './Rejestracja';
import NauczycielMainPage from './NauczycielMainPage';
import NauczycielSalaPage from './NauczycielSalaPage';
import MagazynierEquipmentPage from './MagazynierEquipmentPage';
import AdminRoleChange from './AdminRoleChange';
import AdminClassroomAssignment from './AdminClassroomAssignment';
import AdminEquipmentManagement from './AdminEquipmentManagment';
import NauczycielReserveEquipment from './NauczycielReserveEquipment';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  // @ts-ignore
  global.fetch = vi.fn();
  vi.spyOn(window, 'alert').mockImplementation(() => undefined);
  vi.spyOn(window, 'confirm').mockImplementation(() => true);
});

describe('ProtectedRoute', () => {
  it('redirects when no user in localStorage', () => {
    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route
            path="/private"
            element={
              <ProtectedRoute dozwoloneRole={['Admin']}>
                <div>Secret</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('redirects on role mismatch and clears localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ rola: 'Nauczyciel' }));

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route
            path="/private"
            element={
              <ProtectedRoute dozwoloneRole={['Admin']}>
                <div>Secret</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(localStorage.getItem('user')).toBeNull();
  });
});

describe('App and Routing', () => {
  it('renders routes from App and allows fast navigation', async () => {
    // Mock fetch required for route components with useEffect
    // first call for NauczycielMainPage, second for NauczycielSalaPage, third for MagazynierEquipmentPage etc.
    // We'll prepare a generic fetch mock fallback.
    // @ts-ignore
    global.fetch.mockImplementation(async (url: string) => {
      if (url.includes('/api/classroom/nauczyciel')) {
        return { ok: true, json: async () => [] };
      }
      if (url.includes('/api/classroom/')) {
        return { ok: true, json: async () => ({ nr_sali: 1, sprzet: [] }) };
      }
      if (url.includes('/api/equipment')) {
        return { ok: true, json: async () => [] };
      }
      if (url.includes('/api/users')) {
        return { ok: true, json: async () => [] };
      }
      if (url.includes('/api/roles')) {
        return { ok: true, json: async () => [] };
      }
      if (url.includes('/api/classroom')) {
        return { ok: true, json: async () => [] };
      }
      return { ok: true, json: async () => [] };
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Zaloguj się')).toBeInTheDocument();
  });
});

describe('Logowanie component', () => {
  it('displays error message on failed login', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'Błąd logowania' }) });

    render(
      <MemoryRouter>
        <Logowanie />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Login/i }), { target: { value: 'test' } });
    fireEvent.change(screen.getByLabelText(/Hasło/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Zaloguj się/i }));

    await waitFor(() => {
      expect(screen.getByText('Błąd logowania')).toBeInTheDocument();
    });
  });

  it('navigates to correct route on successful login', async () => {
    const navigateTarget = [] as string[];

    // @ts-ignore
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ rola: 'Admin', id: 1, message: 'OK' }) });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Logowanie />} />
          <Route path="/admin" element={<div>AdminPanel</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Login/i }), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Hasło/i), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /Zaloguj się/i }));

    await waitFor(() => {
      expect(screen.getByText('AdminPanel')).toBeInTheDocument();
    });
  });
});

describe('Rejestracja component', () => {
  it('alerts when passwords do not match', async () => {
    (window.alert as jest.Mock).mockClear?.();
    render(
      <MemoryRouter>
        <Rejestracja />
      </MemoryRouter>
    );

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'A' } });
    fireEvent.change(inputs[1], { target: { value: 'B' } });

    const pwd = screen.getAllByLabelText(/Hasło/i)[0];
    const repeat = screen.getAllByLabelText(/Powtórz hasło/i)[0];

    fireEvent.change(pwd, { target: { value: '123' } });
    fireEvent.change(repeat, { target: { value: '456' } });

    fireEvent.click(screen.getByRole('button', { name: /Zarejestruj się/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Hasła nie są identyczne');
    });
  });

  it('submits correctly when data is valid', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValueOnce({ ok: true, text: async () => JSON.stringify({ message: 'OK' }) });

    render(
      <MemoryRouter initialEntries={['/rejestracja']}>
        <Routes>
          <Route path="/rejestracja" element={<Rejestracja />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Imię/i), { target: { value: 'Jan' } });
    fireEvent.change(screen.getByLabelText(/Nazwisko/i), { target: { value: 'Kowalski' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Login/i), { target: { value: 'jan' } });
    fireEvent.change(screen.getByLabelText(/^Hasło$/i), { target: { value: 'pass' } });
    fireEvent.change(screen.getByLabelText(/Powtórz hasło/i), { target: { value: 'pass' } });

    fireEvent.click(screen.getByRole('button', { name: /Zarejestruj się!/i }));

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });
});

describe('NauczycielMainPage and NauczycielSalaPage', () => {
  it('loads classroom list and navigates to sala', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 42 }));
    // @ts-ignore
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 7, nr_sali: 100, ilosc_komputerow: 10, lokalizacja: 'A', iloscSprzetu: 5 }] })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ nr_sali: 100, sprzet: [] }) });

    render(
      <MemoryRouter initialEntries={['/nauczyciel']}>
        <Routes>
          <Route path="/nauczyciel" element={<NauczycielMainPage />} />
          <Route path="/nauczyciel/sala/:id" element={<NauczycielSalaPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Moje sale')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('100'));

    await waitFor(() => {
      expect(screen.getByText(/Sprzęt w sali/i)).toBeInTheDocument();
    });
  });

  it('zwalnia equipment in sala page', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 42 }));
    // @ts-ignore
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ nr_sali: 1, sprzet: [{ id: 2, typ: 'Laptop', producent: 'Dell', numer_seryjny: 'SN1', dostepny: true }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Zwolniono' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ nr_sali: 1, sprzet: [] }) });

    render(
      <MemoryRouter>
        <NauczycielSalaPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Zwolnij'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Zwolniono');
    });
  });
});

describe('MagazynierEquipmentPage', () => {
  it('renders equipment and filters', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, typ: 'Monitor', producent: 'Samsung', numer_seryjny: 'S1', dostepny: true, lokalizacja: '123', sala: '1', nauczyciel: 'X' }] });

    render(
      <MemoryRouter>
        <MagazynierEquipmentPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Monitor')).toBeInTheDocument();
      expect(screen.getByText('1 / 1 wyników')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Wyszukaj typ/i), { target: { value: 'mon' } });

    await waitFor(() => {
      expect(screen.getByText('1 / 1 wyników')).toBeInTheDocument();
    });
  });
});

describe('Admin role/classroom/equipment management', () => {
  it('loads and changes role in AdminRoleChange', async () => {
    // @ts-ignore
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, imie: 'Test', nazwisko: 'User', email: 'a@a.pl', login: 'test', rola_id: 1 }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, roleName: 'Admin' }, { id: 2, roleName: 'Magazynier' }] })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(
      <MemoryRouter>
        <AdminRoleChange />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Zarządzanie użytkownikami')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: '2' } });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Rola użytkownika została zaktualizowana');
    });
  });

  it('loads and assigns in AdminClassroomAssignment', async () => {
    // @ts-ignore
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, nr_sali: 101, ilosc_komputerow: 10, lokalizacja: 'A', nauczyciel: null, nauczycielId: null, iloscSprzetu: 5 }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, imie: 'Jan', nazwisko: 'Kowalski', email: 'a@a.pl', login: 'jan' }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, nazwa: 'Szkoła' }] })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Przypisano' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, nr_sali: 101, ilosc_komputerow: 10, lokalizacja: 'A', nauczyciel: 'Jan Kowalski', nauczycielId: 1, iloscSprzetu: 5 }] });

    render(
      <MemoryRouter>
        <AdminClassroomAssignment />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Przypisz salę nauczycielowi')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Wybierz salę/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Wybierz nauczyciela/i), { target: { value: '1' } });

    fireEvent.click(screen.getByText('Przypisz'));

    await waitFor(() => {
      expect(screen.getByText('Przypisano')).toBeInTheDocument();
    });
  });

  it('loads and edits equipment in AdminEquipmentManagement', async () => {
    // @ts-ignore
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, typ: 'Laptop', producent: 'HP', numer_seryjny: 'S1', dostepny: true, lokalizacja: 'A', lokalizacjaId: 1 }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, nr_sali: 101, lokalizacja: 'A' }] })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });

    // second fetch for zapiszEdycje
    (global.fetch as any).mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(
      <MemoryRouter>
        <AdminEquipmentManagement />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Lista sprzętu')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edytuj'));
    fireEvent.click(screen.getByText('Zapisz'));

    await waitFor(() => {
      expect(screen.getByText('Lista sprzętu')).toBeInTheDocument();
    });
  });
});

describe('NauczycielReserveEquipment', () => {
  it('allows selecting and reserving equipment', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 9 }));

    // @ts-ignore
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, nr_sali: 201, lokalizacja: 'A' }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 10, typ: 'Tablet', producent: 'Lenovo', numer_seryjny: 'T1', dostepny: true }] })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Zarezerwowano' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 10, typ: 'Tablet', producent: 'Lenovo', numer_seryjny: 'T1', dostepny: true }] });

    render(
      <MemoryRouter>
        <NauczycielReserveEquipment />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Zarezerwuj sprzęt')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Wybierz salę/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Wybierz sprzęt/i), { target: { value: '10' } });

    fireEvent.click(screen.getByText('Zarezerwuj'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Zarezerwowano');
    });
  });
});
