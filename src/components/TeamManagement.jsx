// src/components/TeamManagement.jsx
import { List, Button, Popconfirm, Input, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const TeamManagement = ({ teams, onAddTeam, onDeleteTeam, isMobile }) => {
  const [newTeam, setNewTeam] = useState('');

  const handleAddTeam = () => {
    if (newTeam.trim() && !teams.includes(newTeam)) {
      onAddTeam(newTeam.trim());
      setNewTeam('');
    } else {
      message.error('Team name is invalid or already exists');
    }
  };

  return (
    <div>
      <Space 
        direction={isMobile ? 'vertical' : 'horizontal'}
        style={{ 
          width: '100%',
          marginBottom: isMobile ? '16px' : '24px'
        }}
      >
        <Input
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          placeholder="Enter new team name"
          style={{ 
            width: isMobile ? '100%' : '200px',
          }}
          size={isMobile ? 'middle' : 'large'}
          onPressEnter={handleAddTeam}
        />
        <Button 
          type="primary" 
          onClick={handleAddTeam}
          size={isMobile ? 'middle' : 'large'}
          style={{ width: isMobile ? '100%' : 'auto' }}
        >
          Add Team
        </Button>
      </Space>

      <List
        bordered
        dataSource={teams}
        size={isMobile ? 'small' : 'default'}
        renderItem={team => (
          <List.Item
            actions={[
              <Popconfirm
                title="Delete team"
                description="Are you sure?"
                onConfirm={() => onDeleteTeam(team)}
                okText="Yes"
                cancelText="No"
                disabled={['admin', 'superadmin'].includes(team)}
              >
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  disabled={['admin', 'superadmin'].includes(team)}
                  size={isMobile ? 'small' : 'middle'}
                >
                  {!isMobile && 'Delete'}
                </Button>
              </Popconfirm>
            ]}
          >
            {team}
          </List.Item>
        )}
      />
    </div>
  );
};

export default TeamManagement;