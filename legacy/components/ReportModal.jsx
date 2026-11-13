import { useState } from 'react';
import { submitReport } from '../lib/appwrite';

export default function ReportModal({ isOpen, onClose, videoItem }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reportReason, setReportReason] = useState('broken');
  const [additionalDetails, setAdditionalDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const vId = videoItem?._id || videoItem?.$id || videoItem?.id || videoItem?.slug || '';
      const vTitle = videoItem?.title || 'Unknown Video';
      
      const reasonMap = {
        broken: 'Broken Link / Not Playing',
        harmful: '⚠️ Harmful / Illegal / Dangerous',
        unwanted: '🚫 Unwanted / Non-Consensual',
        fake_spam: 'Fake / Spam / Misleading',
        copyright: 'Copyright (DMCA)',
        other: 'Other Issue'
      };

      await submitReport({
        videoId: String(vId),
        videoTitle: vTitle,
        reason: reasonMap[reportReason] || reportReason,
        captchaToken: reportReason
      });

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 1800);
    } catch (error) {
      console.error("Report submit error:", error);
      alert("Failed to submit report. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div 
        className="report-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className="report-modal-success">
            <div className="report-success-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="report-modal-title">Report Submitted!</h2>
            <p className="report-modal-description" style={{ marginTop: '8px' }}>
              Thank you. Our moderation team has received the alert and will review or delist this link shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="report-modal-header">
              <div className="report-header-flex">
                <div className="report-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h2 className="report-modal-title">Report Video Issue</h2>
              </div>
              <p className="report-modal-description">
                You are reporting an issue with <strong>"{videoItem?.title || 'this video'}"</strong>.
              </p>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Select Issue Type
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  color: '#fff',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="broken">Video Not Playing / Broken Link</option>
                <option value="harmful">⚠️ Harmful / Illegal / Dangerous Content</option>
                <option value="unwanted">🚫 Unwanted / Offensive / Non-Consensual</option>
                <option value="fake_spam">Wrong Title / Fake Video / Spam</option>
                <option value="copyright">Copyright Infringement (DMCA)</option>
                <option value="other">Other Issue</option>
              </select>
            </div>

            <div className="report-modal-actions">
              <button
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="report-submit-btn"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Submit Report'}
              </button>
              <button
                onClick={onClose}
                className="report-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
