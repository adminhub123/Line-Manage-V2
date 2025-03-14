// src/components/MessageSyncHistory.jsx
import { useState, useEffect } from 'react';
import { Card, Button, Space, message, Spin, Empty, Tooltip, Typography, List, Divider, Tag } from 'antd';
import { ReloadOutlined, CheckCircleTwoTone, ClockCircleOutlined } from '@ant-design/icons';
import { getMessageSync } from '../services/messageSyncApi';
import { useMediaQuery } from 'react-responsive';
import dayjs from 'dayjs';
import MessageDetails from './MessageDetails';

const { Text, Title, Paragraph } = Typography;

const MessageSyncHistory = ({ username, team, onClose }) => {
  const [syncData, setSyncData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  useEffect(() => {
    fetchSyncData();
  }, [username]);
  
  const fetchSyncData = async () => {
    setLoading(true);
    try {
      const response = await getMessageSync(username);
      setSyncData(response.data);
    } catch (error) {
      if (error.message === 'No message sync data found for this user') {
        message.info('No message sync data available for this user');
      } else {
        message.error('Failed to fetch message sync data');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewMessageDetails = (message) => {
    setSelectedMessage(message);
    setDetailsVisible(true);
  };
  
  const renderTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
  };
  
  const renderMessageItem = (item, index) => (
    <List.Item>
      <Card 
        hoverable
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>{item.Title || 'Untitled Message'}</Text>
            <Tag color={item.Enabled ? 'success' : 'error'}>
              {item.Enabled ? 'Enabled' : 'Disabled'}
            </Tag>
          </div>
        }
        style={{ width: '100%' }}
        size={isMobile ? 'small' : 'default'}
        onClick={() => handleViewMessageDetails(item)}
      >
        <Paragraph 
          ellipsis={{ rows: 2, expandable: false }}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {item.Content || 'No content available'}
        </Paragraph>
        <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
          <Space split={<Divider type="vertical" />}>
            <span>Created: {renderTimestamp(item.Created)}</span>
            <span>Updated: {renderTimestamp(item.Updated)}</span>
          </Space>
        </div>
      </Card>
    </List.Item>
  );
  
  const cardTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>Message Data: <strong>{username}</strong> {team && `(${team})`}</span>
      <Button icon={<ReloadOutlined />} onClick={fetchSyncData}>
        {!isMobile && 'Refresh'}
      </Button>
    </div>
  );
  
  return (
    <Card
      title={cardTitle}
      style={{ width: '100%' }}
      extra={
        <Button type="default" onClick={onClose}>
          Close
        </Button>
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : !syncData ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No message sync data found for this user"
        />
      ) : (
        <div>
          <Card 
            type="inner" 
            style={{ marginBottom: 16 }}
            size={isMobile ? 'small' : 'default'}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Last Sync Time:</Text>{' '}
                <Tooltip title={new Date(syncData.lastSyncTime).toLocaleString()}>
                  <Space>
                    <ClockCircleOutlined />
                    {dayjs(syncData.lastSyncTime).format('YYYY-MM-DD HH:mm:ss')}
                  </Space>
                </Tooltip>
              </div>
              <div>
                <Text strong>Total Messages:</Text>{' '}
                <Tag color="blue">{syncData.messageCount || 0}</Tag>
              </div>
              <div>
                <Text strong>Team:</Text>{' '}
                {syncData.team || 'N/A'}
              </div>
            </Space>
          </Card>
          
          {syncData.messages && syncData.messages.length > 0 ? (
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 3,
              }}
              dataSource={syncData.messages.slice().sort((a, b) => 
                new Date(b.Created || 0) - new Date(a.Created || 0)
              )}
              renderItem={renderMessageItem}
              pagination={
                syncData.messages.length > 6 && {
                  pageSize: 6,
                  size: isMobile ? 'small' : 'default',
                  showSizeChanger: false,
                }
              }
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No messages found"
            />
          )}
        </div>
      )}
      
      {detailsVisible && selectedMessage && (
        <MessageDetails
          visible={detailsVisible}
          message={selectedMessage}
          onClose={() => setDetailsVisible(false)}
          isMobile={isMobile}
        />
      )}
    </Card>
  );
};

export default MessageSyncHistory;