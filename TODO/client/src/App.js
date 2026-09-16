import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const query = gql`
    query GetTodos {
      getTodos {
      id
    title
    completed
    user {
      name
    }
  }
    }
`;

function App() {
  const { data, loading } = useQuery(query);

  if (loading) return (<h1>Loading...</h1>);

  return (
    <div>
      <table>
        <tbody>
          {data.getTodos.map(todo => <tr key={todo.id}>
            <td>{todo.title}</td>
            <td>{todo.user.name}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  );
}

export default App;
