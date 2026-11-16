import React from "react";

export default class AppErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Erreur d'affichage frontend:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="sm-runtime-error" role="alert">
        <div className="sm-runtime-error-card">
          <span className="sm-runtime-error-mark" aria-hidden="true">!</span>
          <p className="sm-runtime-error-kicker">Star Mousse</p>
          <h1>La page n’a pas pu se charger</h1>
          <p>Un problème temporaire est survenu. Rechargez la page pour reprendre votre navigation.</p>
          <button type="button" onClick={this.handleReload}>Recharger la page</button>
        </div>
      </main>
    );
  }
}
