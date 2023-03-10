import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getTodos,createTodo, patchTodo, deleteTodo } from '../api/todos'
import { useAuth } from '../contexts/AuthContext'

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  //刪除dummyTodos改成axios取得資料
  const [todos, setTodos] = useState([]);
  //取出 isAuthenticated 身分狀態
  const { isAuthenticated, currentMember } = useAuth();

  //監聽InputValue事件
  const handleChange = (value) => {
    setInputValue(value);
  };

  //監聽按下新增看增加todo -> onAddTodo -> createTodo
  const handleAddTodo = async () => {
    if (inputValue.length === 0) return;
    try {
      //將inputValue作為createTodo()的參數
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      //拿到資料後更新畫面todos
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      //新增資料後清空輸入框
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };

  //監聽todoInput的onkeyDown事件 -> createTodo
  const handleKeyDown = async () => {
    if (inputValue.length === 0) return;
    try {
      //將inputValue作為createTodo()的參數
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      //拿到資料後更新畫面todos
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      //新增資料後清空輸入框
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };

  //監聽todoItem的icon，切換完成狀態
  const handleToggleDone = async (id) => {
    //用id查找出當下要toggle的項目再傳給patchTodo修改資料
    const currentTodo = todos.find((todo) => todo.id === id);
    try {
      await patchTodo({ id, isDone: !currentTodo.isDone });
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              isDone: !todo.isDone,
            };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  //監聽todoItem的onDoubleClick修改內容事件
  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit,
          };
        }
        // 其他沒有被點擊的isEdit是false
        return { ...todo, isEdit: false };
      });
    });
  };

  //監聽onSave事件，拿到id和修改的title
  const handleSave = async ({ id, title }) => {
    try {
      await patchTodo({ id, title });
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
              isEdit: false,
            };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  //監聽onDelete事件，刪除todo
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  //useEffect搭配getTodos，在畫面渲染後取得後端資料，拿到所有todos項目，更新todos的state
  useEffect(() => {
    const getTodosAsync = async () => {
      try {
        const todos = await getTodos();
        setTodos(todos.map((todo) => ({ ...todo, isEdit: false })));
      } catch (error) {
        console.error(error);
      }
    };
    //執行
    getTodosAsync();
  }, []);
  //useEffect搭配checkPermission
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  return (
    <div>
      TodoPage
      <Header username={currentMember?.name}/>
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}
      />
      <TodoCollection
        todos={todos}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer numOfTodos={todos} />
    </div>
  );
};

export default TodoPage;
