<template>
  <div>
    <div class="table-container min-w-full" :class="{'overflow-x-auto': responsive, 'overflow-hidden': !responsive, 'relative': loading}">
      <table class="min-w-full" :class="{'text-center': centered, 'border': bordered}">
        <thead :class="{'border-b': !borderless, ...headerBackgroundClass}">
          <tr>
            <th v-if="showRowNum" class="text-sm font-medium" :class="{'text-left': !centered, ...headerCellClass, ...paddingClass}">{{rowNumLabel}}</th>
            <th v-for="(header, key) in headers" :key="key" scope="col" class="text-sm font-medium px-6" :class="{'text-left': !centered, ...headerCellClass, ...paddingClass}">
              {{header.label||header}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="hasSubheading">
            <slot name="subheading" />
          </tr>
          <template v-if="filteredItems.length>0">
            <tr v-for="(item, key) in filteredItems" :key="key" :class="rowClass(key)" v-show="rowVisibility(key+1)">
              <td v-if="showRowNum">{{key+1}}</td>
              <td v-for="(header, index) in headers" :key="index" class="text-sm text-gray-900 font-medium px-6 whitespace-nowrap" :class="[{...paddingClass, 'border-r': bordered}, header.cellClass]">
                <slot :name="header.field||header" v-bind="{value: getCellValue(item, header), row: item, index: key}">
                  {{getCellValue(item, header)}}
                </slot>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td class="text-sm text-slate-500 font-medium px-6 whitespace-nowrap text-center" :class="[{...paddingClass, 'border-r': bordered}]" :colspan="headers.length">
                <slot name="no-data">
                  {{noDataLabel}}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div v-if="loading" class="h-full w-full bg-gray-50 rounded opacity-70 flex justify-center items-center absolute top-0 left-0 z-50">
        <te-spinner size="large" />
      </div>
    </div>
    <te-pagination
      v-if="itemPerPage>0"
      class="my-1"
      :active-page.sync="activePage"
      :pages="pages"
      :pages-to-show="pages"
      :position="paginationAlign"
      :label-next="labelNext"
      :label-prev="labelPrev"
    />
  </div>
</template>

<script>
import tePagination from './tePagination.vue';
import TeSpinner from './teSpinner.vue';

export default {
  name: 'teTable',
  components: { tePagination, TeSpinner },
  props: {
    items: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    striped: {
      type: Boolean,
      default: false,
    },
    hoverable: {
      type: Boolean,
      default: false,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    centered: {
      type: Boolean,
      default: false,
    },
    borderless: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
    responsive: {
      type: Boolean,
      default: true,
    },
    headerType: {
      type: String,
      default: 'normal',
      validator: (value) => ['normal', 'light', 'dark']
    },
    search: {
      type: String,
      default: '',
    },
    noDataLabel: {
      type: String,
      default: 'No Data',
    },
    hasSubheading: {
      type: Boolean,
      default: false,
    },
    showRowNum: {
      type: Boolean,
      default: false,
    },
    rowNumLabel: {
      type: String,
      default: '#',
    },
    itemPerPage: {
      type: Number,
      default: -1
    },
    paginationAlign: {
      type: String,
      default: 'right',
      validator: (value) => ['left', 'center','right'].includes(value)
    },
    labelNext: {
      type: String,
      default: 'Next'
    },
    labelPrev: {
      type: String,
      default: 'Prev.'
    },
    loading: {
      type: Boolean,
      default: false
    },
    backendPagination: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    headerBackgroundClass() {
      return {
        'bg-gray-50': this.headerType === 'light',
        'bg-gray-800': this.headerType === 'dark',
      }
    },
    headerCellClass() {
      return {
        'text-gray-900': this.headerType === 'light',
        'text-white': this.headerType === 'dark',
        'border-r': this.bordered,
      }
    },
    paddingClass () {
      return {
        'py-4': !this.compact,
        'py-2': this.compact,
      }
    },
    filteredItems() {
      if (this.search) {
        const items = this.items.filter(r => {
          const values = Object.values(r);
          return values.some(v => v?.toString().toLowerCase().includes(this.search.toLowerCase()) || false)
        });
        return items;
      }
      return this.items;
    },
    pages() {
      if (this.backendPagination) {
        if (this.total) {
          return Math.ceil(this.total / this.itemPerPage);
        }
        return 0;
      }
      return Math.ceil(this.filteredItems.length / this.itemPerPage);
    }
  },
  data: () => ({
    activePage: 1,
  }),
  watch: {
    activePage(val) {
      this.$emit('page-changed', val);
    },
  },
  methods: {
    rowClass(index) {
      return {
        'border-b': !this.borderless,
        'bg-gray-50': index % 2 === 0 && this.striped,
        'bg-white': index % 2 === 1 && this.striped,
        'transition duration-300 ease-in-out hover:bg-gray-100': this.hoverable,
      }
    },
    rowVisibility(index) {
      if (this.backendPagination) return true;
      if (this.itemPerPage > 0) {
        const last = this.activePage * this.itemPerPage;
        const first = last - this.itemPerPage + 1
        return index >= first && index <= last
      }
      return true;
    },
    getCellValue(item, header) {
      return Object.keys(item).includes(header.field) ?  item[header.field] : item[header];
    }
  }
}
</script>

<style>

</style>