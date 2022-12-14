import React, { useRef, useState } from 'react';
import { Button, Drawer, message, Modal, Space, Switch, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { generatePath, useHistory, useRequest } from 'ice';
import {
  deletePost,
  findManyPostCategory,
  findManyPosts,
  findManyPostTag,
  getPost,
  updatePost,
} from '../common/services';
import { IS_DELETED_ENUM, IS_PUBLISHED_ENUM, Post, POST_TYPE_ENUM } from '../common/types';
import { POST_EDIT_URL } from '@/constants/path';
import MarkdownEditor from '@/components/MarkdownEditor';
import { typeMap } from './config';

export const PostManagement: React.FC = () => {
  const history = useHistory();
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post>({
    categories: [],
    content: '',
    createdAt: new Date(),
    id: '',
    type: POST_TYPE_ENUM.ORIGINAL,
    description: '',
    isDeleted: IS_DELETED_ENUM.NO,
    tags: [],
    title: '',
    updatedAt: new Date(),
    view: 0,
    isPublished: IS_PUBLISHED_ENUM.NO,
    publishedAt: new Date(),
  });

  const { data: tagData } = useRequest(findManyPostTag, { defaultParams: [{ limit: 1000, offset: 0 }], manual: false });
  const { data: categoryData } = useRequest(findManyPostCategory, {
    defaultParams: [{ limit: 1000, offset: 0 }],
    manual: false,
  });
  const { request: deletePostFn } = useRequest(deletePost, {
    manual: true,
  });

  const tagMap = new Map();
  tagData?.data.lists?.forEach((tag) => {
    tagMap.set(tag.id, { text: tag.name, status: tag.id });
  });
  const postTypeMap = new Map();
  postTypeMap.set(POST_TYPE_ENUM.ORIGINAL, { text: '原创', status: POST_TYPE_ENUM.ORIGINAL });
  postTypeMap.set(POST_TYPE_ENUM.TRANSLATION, { text: '翻译', status: POST_TYPE_ENUM.TRANSLATION });
  postTypeMap.set(POST_TYPE_ENUM.TRANSSHIPMENT, { text: '转载', status: POST_TYPE_ENUM.TRANSSHIPMENT });

  const categoryMap = new Map();
  categoryData?.data.lists?.forEach((category) => {
    categoryMap.set(category.id, category.name);
  });

  const isDeletedMap = new Map();
  isDeletedMap.set(IS_DELETED_ENUM.NO, { text: '未删除', status: IS_DELETED_ENUM.NO });
  isDeletedMap.set(IS_DELETED_ENUM.YES, { text: '已删除', status: IS_DELETED_ENUM.YES });

  const isPublishedMap = new Map();
  isPublishedMap.set(IS_PUBLISHED_ENUM.NO, { text: '未发布', status: IS_PUBLISHED_ENUM.NO });
  isPublishedMap.set(IS_PUBLISHED_ENUM.YES, { text: '已发布', status: IS_PUBLISHED_ENUM.YES });

  const columns: Array<ProColumns<Post>> = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      fixed: 'left',
      search: false,
    },
    {
      title: '文章ID',
      width: 120,
      ellipsis: true,
      dataIndex: 'id',
      copyable: true,
      fixed: 'left',
    },
    {
      title: '文章标题',
      width: 300,
      ellipsis: true,
      dataIndex: 'title',
      copyable: true,
      fixed: 'left',
    },
    {
      title: '文章分类',
      width: 300,
      ellipsis: true,
      valueType: 'select',
      dataIndex: 'categories',
      valueEnum: categoryMap,
      fieldProps: { mode: 'multiple' },
      render: (_, post) => (
        <Space>
          {post.categories?.length ? (
            post.categories.map((item) => (
              <Tag key={item.id} color="geekblue">
                {item.name}
              </Tag>
            ))
          ) : (
            <Tag>暂无</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '文章标签',
      dataIndex: 'tags',
      width: 300,
      ellipsis: true,
      valueType: 'select',
      valueEnum: tagMap,
      fieldProps: { mode: 'multiple' }, // 设置下拉框为多选
      render: (_, post) => (
        <Space>
          {post.tags?.length ? (
            post.tags.map((item) => (
              <Tag key={item.id} color="purple">
                {item.name}
              </Tag>
            ))
          ) : (
            <Tag>暂无</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '文章类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: postTypeMap,
      render: (_, post) => (post.type ? <Tag color="gold">{typeMap[post.type]}</Tag> : <Tag>暂无</Tag>),
    },
    {
      title: '文章阅读量',
      width: 120,
      dataIndex: 'view',
      search: false,
    },
    {
      title: '文章简介',
      width: 700,
      ellipsis: true,
      dataIndex: 'description',
      search: false,
    },
    {
      title: '是否发布',
      dataIndex: 'isPublished',
      width: 80,
      valueType: 'select',
      valueEnum: isPublishedMap,
      align: 'center',
      fixed: 'right',
      render: (_, post) => {
        return (
          <Switch
            checked={Boolean(post.isPublished)}
            onClick={async (isPublished) => {
              await updatePost(post.id, { isPublished: Number(isPublished) });
              actionRef.current?.reload();
            }}
          />
        );
      },
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
              await updatePost(post.id, { isDeleted: Number(isDeleted) });
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
      render: (_, post) => [
        <Tooltip placement="top" title="预览文章">
          <Button
            icon={<EyeOutlined />}
            onClick={async () => {
              const data = await getPost(post.id);
              setVisible(true);
              setPreviewPost(data.data);
            }}
          />
        </Tooltip>,
        <Tooltip placement="top" title="编辑文章">
          <Button
            icon={<EditOutlined />}
            type="primary"
            ghost
            onClick={async () => {
              history.push(generatePath(POST_EDIT_URL, { id: post.id }));
            }}
          />
        </Tooltip>,
        <Tooltip placement="top" title="删除文章">
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={async () => {
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: `此操作将会删除标题为【${post.title}】的文章，删除后不可恢复`,
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  await deletePostFn(post.id);
                  actionRef.current?.reload();
                  message.success(`【${post.title}】文章删除成功`);
                },
              });
            }}
          />
        </Tooltip>,
      ],
    },
  ];

  return (
    <>
      <ProTable<Post>
        columns={columns}
        scroll={{ x: 2500 }}
        actionRef={actionRef}
        request={async (params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const {
            current: page = 1,
            pageSize = 10,
            title,
            id,
            categories,
            tags,
            isPublished,
            isDeleted,
            type,
          } = params;
          const { data } = await findManyPosts({
            title,
            id,
            isPublished,
            isDeleted,
            type,
            offset: (page - 1) * pageSize,
            limit: pageSize,
            categories,
            tags,
          });
          return Promise.resolve({
            data: data.lists,
            total: data.total,
            success: true,
          });
        }}
        rowKey={(record) => record.id}
        search={{
          collapsed: false,
          labelWidth: 100,
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle="文章列表"
      />
      <Drawer
        title={previewPost.title}
        placement="right"
        size="large"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <MarkdownEditor modelValue={previewPost.content} previewOnly />
      </Drawer>
    </>
  );
};
