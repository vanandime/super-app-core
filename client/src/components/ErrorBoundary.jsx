import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Modul/Komponen Gist mengalami crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '1px solid #ff4d4f', background: '#fff2f0', borderRadius: '8px' }}>
          <h3>⚠️ Peringatan: Modul Gist Mengalami Error</h3>
          <p>{this.state.error?.message || 'Terjadi kesalahan saat merender modul dinamis.'}</p>
          <button onClick={() => this.setState({ hasError: false })}>Coba Muat Ulang</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
