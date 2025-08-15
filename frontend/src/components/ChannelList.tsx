import React from 'react';
import type { RadioChannel } from '../types/radio';
import './ChannelList.css';

interface ChannelListProps {
  channels: RadioChannel[];
  currentChannel: RadioChannel | null;
  onChannelSelect: (channel: RadioChannel) => void;
  isLoading: boolean;
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  currentChannel,
  onChannelSelect,
  isLoading
}) => {
  return (
    <nav 
      className="channel-list" 
      role="navigation"
      aria-label="Radio channels"
    >
      <h2 className="channel-list__title">RTHK Radio Channels</h2>
      <ul className="channel-list__items" role="list">
        {channels.map((channel) => (
          <li key={channel.id} className="channel-list__item">
            <button
              className={`channel-button ${
                currentChannel?.id === channel.id ? 'channel-button--active' : ''
              }`}
              onClick={() => onChannelSelect(channel)}
              disabled={isLoading}
              aria-pressed={currentChannel?.id === channel.id}
              aria-describedby={`${channel.id}-description`}
            >
              <div className="channel-button__content">
                <h3 className="channel-button__name">{channel.name}</h3>
                <p 
                  className="channel-button__description"
                  id={`${channel.id}-description`}
                >
                  {channel.description}
                </p>
                {channel.isLive && (
                  <span 
                    className="channel-button__live-indicator"
                    aria-label="Live broadcast"
                  >
                    ● LIVE
                  </span>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};