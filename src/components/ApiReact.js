import React, { useState, useEffect } from 'react';
import { AppBar, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';

const API_URL = 'https://reqres.in/api/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newUser, setNewUser] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const editUser = (id) => {
    setEditingId(id);
  };

  const updateUser = async (id, updatedUser) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      console.log('User updated:', data);
      fetchUsers();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      console.log('User added:', data);
      fetchUsers();
      setNewUser({});
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      console.log('User deleted:', id, response);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">User Management</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {editingId === user.id ? (
                      <TextField
                        value={user.first_name}
                        onChange={(e) =>
                          setUsers((prevUsers) =>
                            prevUsers.map((prevUser) =>
                              prevUser.id === user.id
                                ? { ...prevUser, first_name: e.target.value }
                                : prevUser
                            )
                          )
                        }
                      />
                    ) : (
                      user.first_name
                    )}
                  </TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>
                    {editingId === user.id ? (
                      <Button
                        variant="outlined"
                        onClick={() =>
                          updateUser(user.id, { first_name: user.first_name })
                        }
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => editUser(user.id)}>Edit</Button>
                        <Button
                          onClick={() => deleteUser(user.id)}
                          color="secondary"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>New</TableCell>
                <TableCell>
                  <TextField
                    value={newUser.email || ''}
                    onChange={(e) =>
                      setNewUser((prevNewUser) => ({
                        ...prevNewUser,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Email"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newUser.first_name || ''}
                    onChange={(e) =>
                      setNewUser((prevNewUser) => ({
                        ...prevNewUser,
                        first_name: e.target.value,
                      }))
                    }
                    placeholder="First Name"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newUser.last_name || ''}
                    onChange={(e) =>
                      setNewUser((prevNewUser) => ({
                        ...prevNewUser,
                        last_name: e.target.value,
                      }))
                    }
                    placeholder="Last Name"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={addUser}
                    disabled={!newUser.email || !newUser.first_name}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default App;
