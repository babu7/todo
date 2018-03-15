import React, { Component } from 'react';
import styled from 'styled-components';
import setting from '../assets/settings.svg';
import { styler, tween, easing } from 'popmotion';

import Todo from '../Components/Todo';
import EditingTodo from '../Components/EditingTodo';

const setCSStoBlur = (container) => {
  container.style.filter = 'blur(2px)';
  container.style.opacity = '0.7';
};

const setCSSnotBlur = (container) => {
  container.style.filter = 'blur(0px)';
  container.style.opacity = '1';
};

class App extends Component {
  state = {
    todos: [
      { key: '1', data: { text: 'react', isDone: false } },
      { key: '2', data: { text: 'react-native', isDone: false } },
      { key: '3', data: { text: 'redux', isDone: false } },
      { key: '4', data: { text: 'react-redux', isDone: false } },
      { key: '5', data: { text: 'rxjs', isDone: false } },
      { key: '6', data: { text: 'create-react-native-app', isDone: false } },
      { key: '7', data: { text: 'expo', isDone: true } },
      { key: '8', data: { text: 'create-react-app', isDone: false } },
    ],
    value: '',
    editing: {
      text: '',
      key: '',
    },
    mode: 'add', // add, filter
    selected: 'all', // all, completed, uncompleted
  };
  componentDidMount() {
    this.editingTodoStyler = styler(this.editingTodo);
  }
  onCheck = (key) => {
    this.setState({
      todos: this.state.todos.map(todo => (
        todo.key === key
          ? ({
            key,
            data: {
              text: todo.data.text,
              isDone: !todo.data.isDone,
            },
          })
          : todo
      )),
    });
  }
  onDelete = (key) => {
    this.setState({
      todos: this.state.todos.filter(todo => todo.key !== key),
    });
  }
  onEdit = (key, { x, y }) => {
    const todo = this.state.todos.find(t => t.key === key);
    this.setState({
      editing: {
        text: todo.data.text,
        key,
      },
    });
    setCSStoBlur(this.wrapper);
    tween({
      from: { top: y, left: x, opacity: 0 },
      to: { top: y - 5, left: x + 5, opacity: 1 },
      duration: 500,
      ease: easing.backOut,
    }).start(this.editingTodoStyler.set);
  }

  onEdited = (text) => {
    const todoIndex = this.state.todos.findIndex(t => t.key === this.state.editing.key);
    const { key, data: { isDone } } = this.state.todos[todoIndex];
    const y = this.editingTodoStyler.get('top');
    const x = this.editingTodoStyler.get('left');
    this.setState({
      todos: [
        ...this.state.todos.slice(0, todoIndex),
        { key, data: { text, isDone } },
        ...this.state.todos.slice(todoIndex + 1),
      ],
    });
    setTimeout(() => {
      this.setState({
        editing: {
          text: '',
          key: '',
        },
      });
    }, 300);
    setCSSnotBlur(this.wrapper);
    tween({
      from: { top: y, left: x, opacity: 1 },
      to: { top: y + 5, left: x - 5, opacity: 0 },
      duration: 300,
    }).start(this.editingTodoStyler.set);
  }
  handleChange = ({ target: { value } }) => {
    this.setState({ value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.value) {
      this.setState({
        value: '',
        todos: [
          {
            key: new Date(),
            data: {
              text: e.target.firstChild.value,
              isDone: false,
            },
          },
          ...this.state.todos,
        ],
      });
    }
  }
  clearValue = () => {
    this.setState({ value: '' });
  }
  isTodoActive = (isDone, selected) => {
    if (selected === 'all') {
      return true;
    } else if (selected === 'completed') {
      return isDone === true;
    }
    return isDone === false;
  }
  render() {
    const { className } = this.props;
    const { todos, value, selected } = this.state;

    const clearButton = value && <ClearButton onClick={this.clearValue}>X</ClearButton>;
    const todoElements = todos.map(({ key, data: { text, isDone } }) => (
      <Todo
        key={key}
        text={text}
        isDone={isDone}
        active={this.isTodoActive(isDone, selected)}
        onCheck={() => this.onCheck(key)}
        onDelete={() => this.onDelete(key)}
        onEdit={position => this.onEdit(key, position)}
      />
    ));

    return (
      <section className={className}>
        <section className="wrapper" ref={r => this.wrapper = r}>
          <h1 className="todo-title">todos</h1>
          <header>
            <section className="input-container">
              <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="what to do..." value={value} onChange={this.handleChange} />
              </form>
              {clearButton}
            </section>
            <section className="settings">
              <img className="settings-icon" src={setting} alt="settings" />
            </section>
          </header>
          <section className="content">
            {todoElements}
          </section>
          <footer>
            hi i am footer
          </footer>
        </section>
        <EditingTodo text={this.state.editing.text} getRef={r => this.editingTodo = r} onEdited={this.onEdited} />
      </section>
    );
  }
}

const ClearButton = styled.button`
  background-color: transparent;
  border: 0;
  color: white;
  font-size: 1em;
`;

export default styled(App)`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: lightgray;  

  .todo-title {
    position: absolute;
    margin: 0;
    color: white;
    text-shadow: 3px 3px 3px rgba(150, 150, 151, .5);
    transform: translate(30px ,-55px);
  }

  .wrapper {
    transition-duration: .5s;
    background-color: white;
    width: 500px;
    box-shadow: 4px 10px 25px -8px rgba(0,0,0,0.75);
    border-radius: 2px;
  }

  header {
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px; 
    background-color: pink;
    .input-container {
      flex-grow: 1;
      margin-right: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      input {
        font-size: 1em;
        margin: 0;
        height: 100%;
        background-color: transparent;
        border: 0;
      }
      .clear-icon {
        width: 30px;
        height: 30px;
      }
    }
    .settings {
      height: 30px;
      .settings-icon {
        width: 30px;
        height: 30px;
      }
    }
  }
  footer {
    border-top: solid 1px black;
    margin-top: 20px;
  }
`;

