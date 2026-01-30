/* Acceptance.css */
.acceptance-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #aa8d6f 0%, #8b7355 100%);
  padding: 2rem 1.5rem;
  border-radius: 20px;
  box-shadow: 0 12px 28px rgba(170,141,111,0.3);
  margin-bottom: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  filter: blur(40px);
  z-index: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  flex: 1;
  min-width: 250px;
}

.header-title {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.header-subtitle {
  margin-top: 0.8rem;
  font-size: clamp(0.9rem, 2.5vw, 1.05rem);
  opacity: 0.95;
  line-height: 1.4;
}

.header-stats {
  text-align: center;
  background-color: rgba(255,255,255,0.15);
  padding: 1.25rem 1rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  min-width: 180px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  flex-shrink: 0;
}

.header-stats i {
  font-size: clamp(1.8rem, 5vw, 2.3rem);
  margin-bottom: 0.5rem;
  display: block;
}

.stats-content {
  font-size: clamp(0.85rem, 2.5vw, 1rem);
}

.stats-label {
  opacity: 0.9;
  margin-bottom: 0.2rem;
}

.stats-tab {
  font-size: clamp(1rem, 3vw, 1.3rem);
  font-weight: bold;
  margin-bottom: 0.3rem;
  text-transform: capitalize;
}

.stats-count {
  font-size: clamp(0.85rem, 2.5vw, 0.95rem);
  opacity: 0.9;
}

/* Loading */
.loading-container {
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #675541;
  font-size: clamp(1rem, 3vw, 1.1rem);
  gap: 0.5rem;
}

/* Tabs */
.tabs-container {
  margin-bottom: 2rem;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.tab-button {
  border: none;
  padding: clamp(0.6rem, 2vw, 0.7rem) clamp(1rem, 3vw, 1.4rem);
  border-radius: 999px;
  cursor: pointer;
  font-size: clamp(0.85rem, 2.5vw, 0.95rem);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.9);
  color: #675541;
  box-shadow: 0 2px 6px rgba(103,85,65,0.15);
  border-bottom: 1px solid rgba(170,141,111,0.3);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103,85,65,0.25);
}

.tab-button.active {
  background: linear-gradient(135deg, var(--tab-color) 0%, var(--tab-color)cc 100%);
  color: white;
  box-shadow: 0 4px 12px var(--tab-color)55;
  border-bottom: 2px solid rgba(255,255,255,0.7);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: clamp(2rem, 8vw, 3rem);
  background: linear-gradient(135deg, #ffffff 0%, #faf8f6 100%);
  border-radius: 16px;
  margin-top: 1rem;
  box-shadow: 0 8px 16px rgba(103,85,65,0.15);
  border: 1px solid rgba(170,141,111,0.2);
}

.empty-state i {
  font-size: clamp(2rem, 8vw, 3rem);
  color: #ddd;
  margin-bottom: 1rem;
  display: block;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #675541;
  font-size: clamp(1.2rem, 4vw, 1.5rem);
}

.empty-state p {
  color: #888;
  font-size: clamp(0.9rem, 3vw, 1rem);
}

/* Requests Container */
.requests-container {
  margin-top: 1rem;
}

.request-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f6f3 100%);
  padding: clamp(1rem, 4vw, 1.6rem);
  border-radius: 16px;
  margin-bottom: 1rem;
  box-shadow: 0 8px 16px rgba(103,85,65,0.15);
  border: 1px solid rgba(170,141,111,0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .request-card {
    flex-direction: row;
    align-items: flex-start;
  }
}

/* Request Content */
.request-content {
  flex: 1;
}

.request-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
}

.request-header i {
  font-size: clamp(1.3rem, 4vw, 1.6rem);
  color: #aa8d6f;
}

.request-header h4 {
  margin: 0;
  color: #675541;
  font-size: clamp(1rem, 3vw, 1.2rem);
}

.request-details {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.detail-item {
  color: #666;
  font-size: clamp(0.85rem, 2.5vw, 0.95rem);
  line-height: 1.4;
}

.detail-item.email {
  color: #888;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
}

.detail-item.email i {
  margin-right: 0.4rem;
  color: #aa8d6f;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 140px;
  align-self: stretch;
}

@media (min-width: 768px) {
  .action-buttons {
    flex-direction: row;
    min-width: 180px;
    align-self: flex-start;
  }
}

.btn-accept, .btn-reject {
  border: none;
  padding: clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem);
  border-radius: 999px;
  cursor: pointer;
  font-size: clamp(0.85rem, 2.5vw, 0.95rem);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-accept {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(40,167,69,0.35);
}

.btn-reject {
  background: linear-gradient(135deg, #dc3545 0%, #b51f32 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(220,53,69,0.4);
}

.btn-accept:hover, .btn-reject:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

/* Status Badge */
.status-badge {
  min-width: 100px;
  text-align: right;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  font-weight: 600;
  text-transform: capitalize;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4rem;
}

.status-accepted {
  color: #28a745;
  background: rgba(40,167,69,0.1);
}

.status-rejected {
  color: #dc3545;
  background: rgba(220,53,69,0.1);
}

/* Responsive breakpoints */
@media (max-width: 480px) {
  .acceptance-container {
    padding: 0.5rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .header-stats {
    min-width: 100%;
    order: -1;
  }
  
  .tabs-container {
    padding: 0 0.5rem;
  }
  
  .action-buttons {
    flex-direction: row !important;
  }
  
  .btn-accept, .btn-reject {
    flex: none;
    min-width: auto;
  }
}

@media (min-width: 1200px) {
  .acceptance-container {
    padding: 2rem;
  }
}
