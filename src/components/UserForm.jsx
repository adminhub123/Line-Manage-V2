// src/components/UserForm.jsx
import { Form, Input, Select, Modal, Checkbox, DatePicker } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';

const UserForm = ({ visible, onCancel, onSubmit, initialValues, teams, isMobile }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        username: initialValues.username,
        role: initialValues.role,
        team: initialValues.team,
        isWebAdmin: initialValues.isWebAdmin,
        expiration: initialValues.expiration ? dayjs(initialValues.expiration) : null
      });
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const modalStyles = {
    top: isMobile ? 0 : 100,
    maxWidth: isMobile ? '100%' : '600px',
    margin: isMobile ? 0 : '0 auto',
    padding: isMobile ? 0 : undefined
  };

  const formItemLayout = {
    labelCol: { 
      span: isMobile ? 24 : 6 
    },
    wrapperCol: { 
      span: isMobile ? 24 : 18 
    }
  };

  return (
    <Modal
      open={visible}
      title={initialValues ? 'Edit User' : 'Add User'}
      okText="Save"
      cancelText="Cancel"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form.validateFields()
          .then(values => {
            const formattedValues = {
              ...values,
              expiration: values.expiration?.toDate()
            };
            onSubmit(formattedValues);
            form.resetFields();
          })
          .catch(console.error);
      }}
      width={isMobile ? '100%' : '600px'}
      style={modalStyles}
      bodyStyle={{ 
        padding: isMobile ? '16px' : '24px',
        maxHeight: isMobile ? 'calc(100vh - 200px)' : undefined,
        overflowY: 'auto'
      }}
    >
      <Form 
        form={form} 
        layout={isMobile ? 'vertical' : 'horizontal'}
        {...formItemLayout}
        size={isMobile ? 'middle' : 'large'}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please input username!' },
            { min: 3, message: 'Username must be at least 3 characters!' }
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        {!initialValues && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: !initialValues, message: 'Please input password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        )}

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select role!' }]}
        >
          <Select>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="user">User</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="team"
          label="Team"
          rules={[{ required: true, message: 'Please select team!' }]}
        >
          <Select
            showSearch
            allowClear
            options={teams.map(team => ({ label: team, value: team }))}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
            name="expiration"
            label="Expiration Date"
            rules={[{ required: true, message: 'Please select expiration date!' }]}
            initialValue={dayjs().add(1000, 'days')} // Default to 1000 days
          >
            <DatePicker 
              showTime 
              style={{ width: '100%' }}
              disabledDate={(current) => {
                return current && current < dayjs().endOf('day');
              }}
            />
        </Form.Item>

        <Form.Item
          name="isWebAdmin"
          valuePropName="checked"
          wrapperCol={{ 
            offset: isMobile ? 0 : 6, 
            span: isMobile ? 24 : 18 
          }}
        >
          <Checkbox>Can access web management</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;