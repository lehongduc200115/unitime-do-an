import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.error(error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error);
    console.log(errorInfo);
    // send error to log service ...
  }

  render() {
    if (this.state.hasError) {
      return <h4>Something went wrong. Please contact help desk.</h4>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
