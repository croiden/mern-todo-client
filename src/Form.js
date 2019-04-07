import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";

export default class Form extends Component {
    state = {
        text: ""
    };

    handleOnChange = e => {
        this.setState({
            text: e.target.value
        });
    };

    handleKeyDown = e => {
        if (e.key === "Enter") {
            this.props.submit(this.state.text);
            this.setState({
                text: ""
            });
        }
    };
    render() {
        const { text } = this.state;
        return (
            <TextField
                label="Add todo"
                margin="normal"
                fullWidth
                value={text}
                onChange={this.handleOnChange}
                onKeyDown={this.handleKeyDown}
            />
        );
    }
}
