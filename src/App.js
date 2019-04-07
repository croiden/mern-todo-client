import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import Form from "./Form";

const TodosQuery = gql`
    query {
        todos {
            id
            text
            complete
        }
    }
`;

const CreateMutation = gql`
    mutation($text: String!) {
        createTodo(text: $text) {
            id
            text
            complete
        }
    }
`;
const UpdateMutation = gql`
    mutation($id: ID!, $complete: Boolean!) {
        updateTodo(id: $id, complete: $complete)
    }
`;

const DeleteMutation = gql`
    mutation($id: ID!) {
        deleteTodo(id: $id)
    }
`;
class App extends Component {
    updateTodo = async todo => {
        await this.props.updateTodo({
            variables: {
                id: todo.id,
                complete: !todo.complete
            },
            update: proxy => {
                // Read the data from our cache for this query.
                const data = proxy.readQuery({ query: TodosQuery });

                // If you are using the Query service (TodoAppGQL) instead of defining your GQL as a constant, you can reference the query as:
                // const data = proxy.readQuery({ query: this.todoAppGQL.document });

                // Add our todo from the mutation to the end.
                data.todos = data.todos.map(x =>
                    x.id === todo.id
                        ? {
                              ...todo,
                              complete: !todo.complete
                          }
                        : x
                );

                // Write our data back to the cache.
                proxy.writeQuery({ query: TodosQuery, data });

                // alternatively when using Query service:
                // proxy.writeQuery({ query: this.todoAppGQL.document, data });
            }
        });
    };
    removeTodo = async todo => {
        await this.props.deleteTodo({
            variables: {
                id: todo.id
            },
            update: proxy => {
                // Read the data from our cache for this query.
                const data = proxy.readQuery({ query: TodosQuery });

                // If you are using the Query service (TodoAppGQL) instead of defining your GQL as a constant, you can reference the query as:
                // const data = proxy.readQuery({ query: this.todoAppGQL.document });

                // Add our todo from the mutation to the end.
                data.todos = data.todos.filter(x => x.id !== todo.id);

                // Write our data back to the cache.
                proxy.writeQuery({ query: TodosQuery, data });

                // alternatively when using Query service:
                // proxy.writeQuery({ query: this.todoAppGQL.document, data });
            }
        });
    };

    createTodo = async text => {
        await this.props.createTodo({
            variables: {
                text
            },
            update: (proxy, { data: { createTodo } }) => {
                // Read the data from our cache for this query.
                const data = proxy.readQuery({ query: TodosQuery });

                // If you are using the Query service (TodoAppGQL) instead of defining your GQL as a constant, you can reference the query as:
                // const data = proxy.readQuery({ query: this.todoAppGQL.document });

                // Add our todo from the mutation to the end.
                data.todos.unshift(createTodo);

                // Write our data back to the cache.
                proxy.writeQuery({ query: TodosQuery, data });

                // alternatively when using Query service:
                // proxy.writeQuery({ query: this.todoAppGQL.document, data });
            }
        });
    };
    render() {
        const {
            data: { loading, todos }
        } = this.props;

        return (
            <div style={{ display: "flex" }}>
                <div style={{ margin: "auto", width: 400 }}>
                    <Paper elevation={1}>
                        {loading ? (
                            <div>loading...</div>
                        ) : (
                            <>
                                <Form submit={this.createTodo} />
                                <List>
                                    {todos.map(todo => (
                                        <ListItem
                                            key={todo.id}
                                            role={undefined}
                                            dense
                                            button
                                            onClick={() => {
                                                this.updateTodo(todo);
                                            }}
                                        >
                                            <Checkbox
                                                checked={todo.complete}
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                            <ListItemText primary={todo.text} />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    onClick={() => {
                                                        this.removeTodo(todo);
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                    </Paper>
                </div>
            </div>
        );
    }
}

export default compose(
    graphql(TodosQuery),
    graphql(CreateMutation, { name: "createTodo" }),
    graphql(UpdateMutation, { name: "updateTodo" }),
    graphql(DeleteMutation, { name: "deleteTodo" })
)(App);
