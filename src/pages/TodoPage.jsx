import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useState } from 'react'

const dummyTodos = [
  {
    title: 'Learn react-router',
    isDone: true,
    id: 1,
  },
  {
    title: 'Learn to create custom hooks',
    isDone: false,
    id: 2,
  },
  {
    title: 'Learn to use context',
    isDone: true,
    id: 3,
  },
  {
    title: 'Learn to implement auth',
    isDone: false,
    id: 4,
  },
];

const TodoPage = () => {
  const [inputValue,setInputValue] = useState('')
  const [todos,setTodos] = useState(dummyTodos)

  //監聽InputValue事件
  const handleChange = (value) => {
    setInputValue(value)
  }

  //監聽按下新增看增加todo -> onAddTodo
  const handleAddTodo = () => {
    if (inputValue.length === 0) return
    setTodos((prevTodos) => {
      return [
        ...prevTodos,
      {
        id: Math.random()*100,
        title: inputValue,
        isDone: false
      }]
    })
    //新增資料後清空輸入框
    setInputValue('')
  }

  //監聽todoInput的onkeyDown事件
  const handleKeyDown = (event) => {
    if (inputValue.length === 0) return;
    setTodos((prevTodos) => {
      return [
        ...prevTodos,
        {
          id: Math.random() * 100,
          title: inputValue,
          isDone: false,
        },
      ];
    });
    //新增資料後清空輸入框
    setInputValue('');
  }

  //監聽todoItem的icon，切換完成狀態
  const handleToggleDone = (id) => {
    setTodos((prevTodos) => {
      return prevTodos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            isDone: !todo.isDone
          }
        }
        return todo
      })
    })
  }

  //監聽todoItem的onDoubleClick修改內容事件
  const handleChangeMode = ({id, isEdit}) => {
    setTodos((prevTodos) => {
      return prevTodos.map(todo => {
        if ( todo.id === id)  {
          return {
            ...todo, isEdit
          }
        }
        // 其他沒有被點擊的isEdit是false
        return {...todo,isEdit:false}
      })
    })
  }
  
  //監聽onSave事件，拿到id和修改的title
  const handleSave = ({id, title}) => {
    setTodos((prevTodos) => {
      return prevTodos.map(todo => {
        if( todo.id === id ) {
          return {
            ...todo,
            title,
            isEdit: false
          };
        }
        return todo
      })
    })
  }

  //監聽onDelete事件，刪除todo
  const handleDelete = (id) => {
    setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id)
    )
  }
  return (
    <div>
      TodoPage
      <Header />
      <TodoInput 
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}/>
      <TodoCollection todos={todos}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}/>
      <Footer todos={todos}/>
    </div>
  );
};

export default TodoPage;
