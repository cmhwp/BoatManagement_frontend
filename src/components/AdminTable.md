# AdminTable 通用管理表格组件

## 概述
AdminTable 是一个通用的管理后台表格组件，封装了搜索、分页、详情查看等常用功能，可以快速构建管理页面。

## 基本用法

```vue
<template>
  <AdminTable
    title="用户管理"
    subtitle="管理平台所有用户账户"
    :columns="columns"
    :search-config="searchConfig"
    :action-config="actionConfig"
    :detail-config="detailConfig"
    :api-config="apiConfig"
    @edit="handleEdit"
    @menu-action="handleMenuAction"
  >
    <!-- 自定义列渲染 -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'custom'">
        <!-- 自定义列内容 -->
      </template>
    </template>

    <!-- 自定义详情页面 -->
    <template #detail="{ record }">
      <!-- 自定义详情内容 -->
    </template>
  </AdminTable>
</template>
```

## Props

### 基础属性
- `title`: 页面标题
- `subtitle`: 页面副标题
- `columns`: 表格列配置

### 搜索配置 (searchConfig)
```javascript
{
  placeholder: '搜索用户名、邮箱或姓名',
  filters: [
    {
      key: 'role',
      placeholder: '选择角色',
      span: 6,  // 可选，控制列宽
      options: [
        { label: '全部角色', value: '' },
        { label: '管理员', value: 'admin' }
      ]
    }
  ]
}
```

### 操作配置 (actionConfig)
```javascript
{
  moreActions: [
    { key: 'resetPassword', label: '重置密码' },
    { key: 'delete', label: '删除', danger: true }
  ]
}
```

### 详情配置 (detailConfig)
```javascript
{
  title: '用户详情',
  width: 600,
  fields: [
    { key: 'username', label: '用户名', type: 'text' },
    { key: 'created_at', label: '创建时间', type: 'date' },
    { key: 'status', label: '状态', type: 'tag' }
  ]
}
```

### API配置 (apiConfig)
```javascript
{
  list: listUsersApi,           // 列表API
  detail: getUserDetailApi,     // 详情API（可选）
  listParams: (searchForm, pagination) => ({
    page: pagination.current,
    page_size: pagination.pageSize,
    search: searchForm.search || undefined
  }),
  detailParams: (record) => ({
    id: record.id
  })
}
```

## 事件

- `@edit`: 点击编辑按钮时触发
- `@view`: 点击查看按钮时触发
- `@menu-action`: 点击更多操作菜单项时触发

## 插槽

### bodyCell
用于自定义表格列内容
```vue
<template #bodyCell="{ column, record }">
  <template v-if="column.key === 'status'">
    <a-tag :color="getStatusColor(record.status)">
      {{ getStatusText(record.status) }}
    </a-tag>
  </template>
</template>
```

### detail
用于自定义详情抽屉内容
```vue
<template #detail="{ record }">
  <div class="custom-detail">
    <!-- 自定义详情内容 -->
  </div>
</template>
```

### detail-{fieldKey}
用于自定义特定字段的显示（当使用默认详情模板时）
```vue
<template #detail-status="{ record, value }">
  <a-tag :color="getStatusColor(value)">
    {{ getStatusText(value) }}
  </a-tag>
</template>
```

## 方法

组件暴露了以下方法：
- `loadData()`: 重新加载数据
- `refresh()`: 刷新数据（同loadData）

使用ref调用：
```vue
<template>
  <AdminTable ref="tableRef" ... />
</template>

<script setup>
const tableRef = ref()

const refreshTable = () => {
  tableRef.value?.refresh()
}
</script>
```

## 完整示例

参考 `src/views/admin/Users.vue` 和 `src/views/admin/Merchants.vue` 的实现。 