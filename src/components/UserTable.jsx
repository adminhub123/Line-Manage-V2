// src/components/UserTable.jsx
import { Table, Button, Space, Popconfirm, Input, Tooltip, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Search } = Input;
const { Text } = Typography;

const UserTable = ({ users, onEdit, onDelete, loading, isMobile, isTablet }) => {
  const [searchText, setSearchText] = useState('');

  const getColumns = () => {
    const baseColumns = [
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
        width: isMobile ? 120 : 150,
        sorter: (a, b) => a.username.localeCompare(b.username),
        render: (text) => (
          <Tooltip title={text}>
            <Text ellipsis style={{ maxWidth: isMobile ? 100 : 130 }}>
              {text}
            </Text>
          </Tooltip>
        ),
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        width: isMobile ? 80 : 100,
        filters: [
          { text: 'Admin', value: 'admin' },
          { text: 'Superadmin', value: 'superadmin' },
        ],
        onFilter: (value, record) => record.role === value,
      },
      {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        width: isMobile ? 100 : 120,
        render: (text) => (
          <Tooltip title={text}>
            <Text ellipsis style={{ maxWidth: isMobile ? 80 : 100 }}>
              {text}
            </Text>
          </Tooltip>
        ),
      },
      {
        title: 'Web Access',
        dataIndex: 'isWebAdmin',
        key: 'isWebAdmin',
        width: isMobile ? 90 : 100,
        render: (isWebAdmin) => (
          <Text type={isWebAdmin ? 'success' : 'secondary'}>
            {isWebAdmin ? 'Yes' : 'No'}
          </Text>
        ),
      },
      {
        title: 'Expiration',
        dataIndex: 'expiration',
        key: 'expiration',
        width: isMobile ? 150 : 180,
        render: (date) => {
          const formattedDate = date ? new Date(date).toLocaleString() : 'Never';
          return (
            <Tooltip title={formattedDate}>
              <Text ellipsis style={{ maxWidth: isMobile ? 130 : 160 }}>
                {formattedDate}
              </Text>
            </Tooltip>
          );
        },
        sorter: (a, b) => new Date(a.expiration) - new Date(b.expiration),
      },
      {
        title: 'Last Login',
        dataIndex: 'lastLogin',
        key: 'lastLogin',
        width: isMobile ? 150 : 180,
        render: (date) => {
          const formattedDate = date ? new Date(date).toLocaleString() : 'Never';
          return (
            <Tooltip title={formattedDate}>
              <Text ellipsis style={{ maxWidth: isMobile ? 130 : 160 }}>
                {formattedDate}
              </Text>
            </Tooltip>
          );
        },
        sorter: (a, b) => new Date(a.lastLogin || 0) - new Date(b.lastLogin || 0),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: isMobile ? 100 : 150,
        render: (_, record) => (
          <Space size="small">
            <Tooltip title="Edit user">
              <Button 
                icon={<EditOutlined />} 
                onClick={() => onEdit(record)}
                size={isMobile ? 'small' : 'middle'}
              >
                {!isMobile && 'Edit'}
              </Button>
            </Tooltip>
            <Tooltip title="Delete user">
              <Popconfirm
                title="Delete user"
                description="Are you sure you want to delete this user?"
                onConfirm={() => onDelete(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  size={isMobile ? 'small' : 'middle'}
                >
                  {!isMobile && 'Delete'}
                </Button>
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];

    return baseColumns;
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.team.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div style={{ 
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '8px' : '16px'
      }}>
        <Search
          placeholder="Search users..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ 
            width: isMobile ? '100%' : '300px',
          }}
          size={isMobile ? 'middle' : 'large'}
        />
        <Space>
          <Tooltip title="All columns are visible">
            <InfoCircleOutlined style={{ color: '#1890ff' }} />
          </Tooltip>
          <Text type="secondary">
            {isMobile ? 'Scroll to view all' : 'All columns are visible'}
          </Text>
        </Space>
      </div>
      
      <Table
        columns={getColumns()}
        dataSource={filteredUsers}
        rowKey="_id"
        loading={loading}
        scroll={{ 
          x: 'max-content',
          y: `calc(100vh - ${isMobile ? '280px' : '230px'})`,
        }}
        pagination={{
          position: ['bottomCenter'],
          size: isMobile ? 'small' : 'default',
          pageSize: isMobile ? 10 : 20,
          showSizeChanger: !isMobile,
          showQuickJumper: !isMobile,
          showTotal: (total) => `Total ${total} users`,
        }}
        size={isMobile ? 'small' : 'middle'}
        style={{
          maxWidth: '100%',
          overflowX: 'auto',
        }}
      />
    </div>
  );
};

export default UserTable;