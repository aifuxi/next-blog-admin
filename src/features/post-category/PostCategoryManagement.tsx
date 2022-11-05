import { createPostCategory, updatePostCategory, findManyPostCategory } from '@/features/common/services';
import { CreatePostCategoryReq, PostCategory } from '@/features/common/types';
import React, { useMemo, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Switch, Tooltip } from 'antd';
import { ProFormText, ProFormTextArea, ModalForm, ProFormInstance } from '@ant-design/pro-form';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

export const PostCategoryManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<CreatePostCategoryReq>>();
  const [visible, setVisible] = useState(false);
  const [currentPostCategory, setCurrentPostCategory] = useState<PostCategory>({
    description: '',
    id: '',
    isDeleted: false,
    name: '',
  });

  const title = useMemo(() => {
    return currentPostCategory.id ? '编辑文章分类' : '新建文章分类';
  }, [currentPostCategory]);
  const columns: Array<ProColumns<PostCategory>> = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      search: false,
    },
    {
      title: '文章分类ID',
      width: 250,
      ellipsis: true,
      dataIndex: 'id',
      copyable: true,
    },
    {
      title: '文章分类名称',
      width: 150,
      ellipsis: true,
      dataIndex: 'name',
      copyable: true,
    },
    {
      title: '文章分类简介',
      width: 500,
      ellipsis: true,
      dataIndex: 'description',
      search: false,
    },
    {
      title: '是否删除',
      dataIndex: 'isDeleted',
      width: 80,
      align: 'center',
      fixed: 'right',
      search: false,
      render: (_, post) => {
        return (
          <Switch
            checked={post.isDeleted}
            onClick={async (isDeleted) => {
              await updatePostCategory(post.id, { isDeleted });
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
          <Tooltip placement="top" title="编辑文章文章分类">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentPostCategory(category);
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
        open={visible}
        formRef={formRef}
        title={title}
        onOpenChange={(v) => {
          setVisible(v);
        }}
        trigger={
          <Button type="primary" style={{ marginBottom: 12 }} onClick={() => setVisible(true)}>
            <PlusOutlined />
            新建文章分类
          </Button>
        }
        onFinish={async (values: CreatePostCategoryReq) => {
          if (currentPostCategory.id) {
            // 存在id,则是编辑状态
            await updatePostCategory(currentPostCategory.id, { name: values.name, description: values.description });
            message.success('修改成功');
          } else {
            // 创建
            await createPostCategory(values);
            message.success('创建成功');
          }
          formRef.current?.resetFields();
          setVisible(false);
          actionRef.current?.reload();
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入文章分类名称',
            },
          ]}
          name="name"
          label="文章分类名称"
          placeholder="请输入文章分类名称"
        />
        <ProFormTextArea name="description" label="文章分类描述" placeholder="请输入文章分类描述" />
      </ModalForm>

      <ProTable<PostCategory>
        columns={columns}
        actionRef={actionRef}
        scroll={{ x: 1500 }}
        search={{
          collapsed: false,
          labelWidth: 100,
        }}
        pagination={{
          pageSize: 10,
        }}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const { current: page = 1, pageSize = 10, name, id } = params;
          const { data } = await findManyPostCategory({ name, id, offset: (page - 1) * pageSize, limit: pageSize });
          return Promise.resolve({
            data: data.lists,
            total: data.total,
            success: true,
          });
        }}
        rowKey={(record) => record.id}
        dateFormatter="string"
        headerTitle="文章分类列表"
      />
    </>
  );
};
