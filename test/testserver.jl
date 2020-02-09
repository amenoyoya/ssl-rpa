"""
Selenium 動作確認用サーバ
"""

using Genie, Genie.Router, Genie.Renderer.Json, Genie.Requests
using HTTP

route("/") do
    read("./public/index.html") |> String
end

# POST /api/server => {server: "apache"|"nginx", cache: [100..500:100]}
route("/api/server", method = POST) do
    server = postpayload(:server, "nginx")
    cache = postpayload(:cache, "100")
    (:server => server, :cache => cache) |> json
end

# Genie設定: http://localhost:8080
Genie.config.run_as_server = true
Genie.config.server_port = 8080
Genie.config.server_host = "0.0.0.0"
# Nginxのように静的ファイルを配信: ./public/*
# Genie.config.server_handle_static_files = true
# Genie.config.server_document_root = "./public/"

# Genie起動
Genie.startup()
