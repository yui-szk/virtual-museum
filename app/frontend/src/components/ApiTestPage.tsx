import React, { useState } from 'react'
import {
  healthCheck,
  fetchPublicMuseums,
  fetchMuseumById,
  createMuseum,
  updateMuseumTitle,
  searchArtworks,
  fetchMetObject,
} from '../lib/api'

export default function ApiTestPage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }))
    try {
      console.log(`🧪 [TEST] Starting ${testName}`)
      const result = await testFn()
      console.log(`✅ [TEST] ${testName} succeeded:`, result)
      setResults(prev => ({ ...prev, [testName]: { success: true, data: result } }))
    } catch (error) {
      console.error(`❌ [TEST] ${testName} failed:`, error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setResults(prev => ({
        ...prev,
        [testName]: {
          success: false,
          error: errorMessage,
          fullError: error
        }
      }))
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }))
    }
  }

  const tests = [
    {
      name: 'healthCheck',
      label: 'ヘルスチェック',
      fn: () => healthCheck()
    },
    {
      name: 'fetchPublicMuseums',
      label: '公開ミュージアム取得',
      fn: () => fetchPublicMuseums(1, 5)
    },
    {
      name: 'fetchMuseumById',
      label: 'ミュージアム詳細取得',
      fn: () => fetchMuseumById(12) // 存在するIDを使用
    },
    {
      name: 'createMuseum',
      label: 'ミュージアム作成',
      fn: () => createMuseum({
        userId: 2, // 既存ユーザーIDを使用
        name: 'Frontend Test Museum',
        description: 'Created from API test page',
        visibility: 'public'
        // imageUrlは省略（オプショナル）
      })
    },
    {
      name: 'updateMuseumTitle',
      label: 'ミュージアムタイトル更新',
      fn: () => updateMuseumTitle(12, 'Updated Title from Frontend') // 存在するIDを使用
    },
    {
      name: 'searchArtworks',
      label: '作品検索',
      fn: () => searchArtworks({ isHighlight: true, limit: 3 })
    },
    {
      name: 'fetchMetObject',
      label: 'MET オブジェクト詳細',
      fn: () => fetchMetObject(45734)
    }
  ]

  const runAllTests = async () => {
    // まず公開ミュージアムを取得して、存在するIDを確認
    try {
      console.log('🔍 [TEST] Getting available museum IDs...')
      const museums = await fetchPublicMuseums(1, 5)
      const availableId = museums.length > 0 ? museums[0].id : 12
      console.log('📋 [TEST] Using museum ID:', availableId)

      // 動的にテストを更新
      const dynamicTests = tests.map(test => {
        if (test.name === 'fetchMuseumById') {
          return { ...test, fn: () => fetchMuseumById(availableId) }
        }
        if (test.name === 'updateMuseumTitle') {
          return { ...test, fn: () => updateMuseumTitle(availableId, `Updated Title ${Date.now()}`) }
        }
        return test
      })

      for (const test of dynamicTests) {
        await runTest(test.name, test.fn)
        // 少し間隔を空ける
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error('❌ [TEST] Failed to get museum IDs:', error)
      // フォールバックとして元のテストを実行
      for (const test of tests) {
        await runTest(test.name, test.fn)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API エンドポイント テスト</h1>

      <div className="mb-6">
        <button
          onClick={runAllTests}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
        >
          全テスト実行
        </button>
        <span className="text-sm text-gray-600">
          ※ コンソールでデバッグログも確認してください
        </span>
      </div>

      <div className="grid gap-4">
        {tests.map((test) => (
          <div key={test.name} className="border rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{test.label}</h3>
              <button
                onClick={() => runTest(test.name, test.fn)}
                disabled={loading[test.name]}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
              >
                {loading[test.name] ? '実行中...' : 'テスト'}
              </button>
            </div>

            {results[test.name] && (
              <div className={`p-3 rounded text-sm ${results[test.name].success
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                }`}>
                {results[test.name].success ? (
                  <div>
                    <div className="font-semibold">✅ 成功</div>
                    <pre className="mt-1 text-xs overflow-auto">
                      {JSON.stringify(results[test.name].data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <div className="font-semibold">❌ エラー</div>
                    <div className="mt-1">{results[test.name].error}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}