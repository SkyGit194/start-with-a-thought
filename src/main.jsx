import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

class ErrorBoundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#fff', color: '#000', padding: '2rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          <strong>App failed to render:</strong>{'\n\n'}
          {this.state.error.toString()}{'\n\n'}
          {this.state.error.stack}
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
