import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', completed: false });
  const [editTodo, setEditTodo] = useState(null);

  const API_URL = 'http://localhost:5000/api/todos';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Ошибка загрузки');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) throw new Error('Ошибка создания');
      setNewTodo({ title: '', completed: false });
      await fetchTodos();
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleUpdate = async (id, updatedTodo) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) throw new Error('Ошибка обновления');
      await fetchTodos();
      setEditTodo(null);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Ошибка удаления');
      await fetchTodos();
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className="App">
      <h1 className='zagalovok'>Менеджер задач</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          placeholder="Новая задача"
          required
          className='input'
        />
        <button type="submit" className='button1'>Добавить</button>
      </form>

      <div className="todos-list">
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            {editTodo?.id === todo.id ? (
              <input
                value={editTodo.title}
                onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
                style={{
                  textDecoration: editTodo.completed ? 'line-through' : 'none',
                }}
              />
            ) : (
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }} className='text'>
                {todo.title}

              </span>
            )}

            <div className="actions">
              <input
                type="checkbox"
                className='check'
                checked={todo.completed}
                onChange={() => handleUpdate(todo.id, { ...todo, completed: !todo.completed })}
              />
              {editTodo?.id === todo.id ? (
                <button
                  className='knopka'
                  onClick={() => handleUpdate(todo.id, editTodo)}
                  style={{ marginLeft: '10px' }}
                >
                  Сохранить
                </button>
              ) : (
                <button
                  className='knopka'
                  onClick={() => setEditTodo(todo)}
                  style={{ marginLeft: '10px' }}
                >
                  Редактировать
                </button>
              )}
              <button
                className='knopka'
                onClick={() => handleDelete(todo.id)}
                style={{ marginLeft: '10px' }}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;