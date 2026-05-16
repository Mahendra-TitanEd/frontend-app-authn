/* eslint-disable react/prop-types */
import React, {
  createContext, useCallback, useContext, useMemo, useState,
} from 'react';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ToastProvider.scss';

const AUTO_DISMISS_MS = 4000;
const EXIT_MS = 260;

const ToastContext = createContext({
  showToast: () => {},
  dismiss: () => {},
});

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const closeToast = useCallback((id) => {
    setToasts((prev) => prev.map((item) => (
      item.id === id ? { ...item, isClosing: true } : item
    )));
    window.setTimeout(() => {
      removeToast(id);
    }, EXIT_MS);
  }, [removeToast]);

  const dismiss = closeToast;

  const showToast = useCallback(({
    title = '',
    description = '',
    duration = AUTO_DISMISS_MS,
  }) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, {
      id,
      title,
      description,
      isClosing: false,
    }]);
    if (duration > 0) {
      window.setTimeout(() => {
        closeToast(id);
      }, duration);
    }
    return id;
  }, [closeToast]);

  const value = useMemo(() => ({ showToast, dismiss }), [showToast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ol className="app-toast-viewport" tabIndex={-1}>
        {toasts.map((toast) => (
          <li
            className={`app-toast ${toast.isClosing ? 'is-closing' : ''}`}
            key={toast.id}
            role="status"
          >
            <div>
              {toast.title ? <p className="app-toast__title">{toast.title}</p> : null}
              {toast.description ? (
                <p className="app-toast__description">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              className="app-toast__close"
              aria-label="Close"
              onClick={() => closeToast(toast.id)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </li>
        ))}
      </ol>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context?.showToast) {
    throw new Error('useToast must be used within ToastProvider (custom UI only).');
  }
  return context;
};

export {
  ToastProvider,
  useToast,
};
