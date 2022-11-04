import React, { useMemo, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Category, CreateCategoryReq, CreateTagReq } from '@/types/post';
import { Button, message, Switch, Tooltip } from 'antd';
import { createCategory, queryCategory, updateCategory } from '@/pages/Post123/services/category';
import { ProFormText, ProFormTextArea, ModalForm, ProFormInstance } from '@ant-design/pro-form';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const emptyCategory = {
  createdAt: '',
  desc: '',
  id: '',
  isDelete: false,
  name: '',
  updatedAt: '',
};
const PostCategory: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<CreateCategoryReq>>();
  const [visible, setVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>(emptyCategory);

  const title = useMemo(() => {
    return currentCategory.id ? '编辑分类' : '新建分类';
  }, [currentCategory]);
  const columns: Array<ProColumns<Category>> = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      search: false,
    },
    {
      title: '分类ID',
      width: 120,
      ellipsis: true,
      dataIndex: 'id',
      copyable: true,
    },
    {
      title: '分类名称',
      width: 150,
      ellipsis: true,
      dataIndex: 'name',
      copyable: true,
    },
    {
      title: '分类简介',
      width: 700,
      ellipsis: true,
      dataIndex: 'desc',
      search: false,
    },
    {
      title: '是否删除',
      dataIndex: 'isDelete',
      width: 80,
      align: 'center',
      fixed: 'right',
      search: false,
      render: (_, post) => {
        return (
          <Switch
            checked={post.isDelete}
            onClick={async (isDelete) => {
              await updateCategory(post.id, { isDelete });
              actionRef.current?.reload();
            }}
          />
        );
      },
    },
    {
      title: '创建时间',
      width: 180,
      dataIndex: 'createdAt',
      align: 'center',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '更新时间',
      width: 180,
      dataIndex: 'updatedAt',
      align: 'center',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      width: 60,
      align: 'center',
      fixed: 'right',
      valueType: 'option',
      search: false,
      render: (_, category) => {
        return (
          <Tooltip placement="top" title="编辑文章分类">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentCategory(category);
                const timer = window.setTimeout(() => {
                  // 这里设置延时是因为第一次，form可能未创建，立即设置值可能不生效，所以设置延时
                  formRef.current?.setFieldsValue(category);
                  window.clearTimeout(timer);
                }, 500);
                setVisible(true);
              }}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      <ModalForm
        visible={visible}
        formRef={formRef}
        title={title}
        onVisibleChange={(v) => {
          setVisible(v);
        }}
        trigger={
          <Button type="primary" style={{ marginBottom: 12 }} onClick={() => setVisible(true)}>
            <PlusOutlined />
            新建分类
          </Button>
        }
        onFinish={async (values: CreateTagReq) => {
          if (currentCategory.id) {
            // 存在id,则是编辑状态
            await updateCategory(currentCategory.id, { name: values.name, desc: values.desc });
            message.success('修改成功');
          } else {
            // 创建
            await createCategory(values);
            message.success('创建成功');
          }
          console.log(values);
          formRef.current?.resetFields();
          setVisible(false);
          actionRef.current?.reload();
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入文章标题',
            },
          ]}
          name="name"
          label="分类名称"
          placeholder="请输入分类名称"
        />
        <ProFormTextArea
          rules={[
            {
              required: true,
              message: '请输入文章标题',
            },
          ]}
          name="desc"
          label="分类描述"
          placeholder="请输入分类描述"
        />
      </ModalForm>

      <ProTable<Category>
        columns={columns}
        actionRef={actionRef}
        scroll={{ x: 1500 }}
        search={{
          collapsed: false,
        }}
        pagination={{
          pageSize: 10,
        }}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter);
          const { current: page = 1, pageSize = 10, name, id } = params;
          const { data } = await queryCategory({ name, page, pageSize, id });
          return Promise.resolve({
            data,
            success: true,
          });
        }}
        rowKey={(record) => record.id}
        dateFormatter="string"
        headerTitle="分类列表"
      />
    </>
  );
};

export default PostCategory;
