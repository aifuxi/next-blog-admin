import {
  createPostCategory,
  deletePostCategory,
  findManyPostCategory,
  updatePostCategory,
} from '@/features/common/services';
import { CreatePostCategoryReq, IS_DELETED_ENUM, PostCategory } from '@/features/common/types';
import React, { useMemo, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Modal, Space, Switch, Tooltip } from 'antd';
import { ModalForm, ProFormInstance, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ice';

export const PostCategoryManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<CreatePostCategoryReq>>();
  const [visible, setVisible] = useState(false);
  const [currentPostCategory, setCurrentPostCategory] = useState<PostCategory>({
    description: '',
    id: '',
    isDeleted: IS_DELETED_ENUM.NO,
    name: '',
  });
  const { request: deletePostCategoryFn } = useRequest(deletePostCategory, {
    manual: true,
  });

  const title = useMemo(() => {
    return currentPostCategory.id ? '编辑文章分类' : '新建文章分类';
  }, [currentPostCategory]);

  const isDeletedMap = new Map();
  isDeletedMap.set(IS_DELETED_ENUM.NO, { text: '未删除', status: IS_DELETED_ENUM.NO });
  isDeletedMap.set(IS_DELETED_ENUM.YES, { text: '已删除', status: IS_DELETED_ENUM.YES });

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
      title: '软删除',
      dataIndex: 'isDeleted',
      tooltip: '软删除后的数据在前端不可见，后台可见',
      width: 80,
      valueType: 'select',
      valueEnum: isDeletedMap,
      align: 'center',
      fixed: 'right',
      render: (_, post) => {
        return (
          <Switch
            checked={Boolean(post.isDeleted)}
            onClick={async (isDeleted) => {
              await updatePostCategory(post.id, { isDeleted: Number(isDeleted) });
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
      width: 150,
      align: 'center',
      fixed: 'right',
      valueType: 'option',
      search: false,
      render: (_, category) => {
        return (
          <Space>
            <Tooltip placement="top" title="编辑文章分类">
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
            <Tooltip placement="top" title="删除文章分类">
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: <ExclamationCircleOutlined />,
                    content: `此操作将会删除名称为【${category.name}】的文章分类，删除后不可恢复`,
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                      await deletePostCategoryFn(category.id);
                      actionRef.current?.reload();
                      message.success(`【${category.name}】文章分类删除成功`);
                    },
                  });
                }}
              />
            </Tooltip>
          </Space>
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
        request={async (params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const { current: page = 1, pageSize = 10, name, id, isDeleted } = params;
          const { data } = await findManyPostCategory({
            name,
            id,
            offset: (page - 1) * pageSize,
            limit: pageSize,
            isDeleted,
          });
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
