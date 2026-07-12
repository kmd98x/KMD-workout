```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Steady</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#000000;--surface:#1C1C1E;--surface-2:#2C2C2E;--line:#38383A;
    --blue:#2F80FF;--blue-dim:rgba(47,128,255,.16);--green:#30D158;--danger:#FF453A;--orange:#FF9F6B;
    --ink:#FFFFFF;--muted:#98989F;--muted-2:#6B6B72;--thumb:#C7C7CC;
    --sec:#FF9F6B;
    --radius:16px;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{background:var(--bg);color:var(--ink);font-family:"Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.45}
  .wrap{max-width:520px;margin:0 auto;padding:20px 18px 120px;min-height:100vh}

  .dlg-back{position:fixed;inset:0;background:rgba(0,0,0,.62);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px}
  .dlg{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:22px;max-width:340px;width:100%}
  .dlg-msg{font-size:15px;line-height:1.45;color:var(--ink);margin-bottom:20px}
  .dlg-btns{display:flex;gap:10px;justify-content:flex-end}
  .dlg-b{border:none;border-radius:10px;padding:11px 18px;font-family:inherit;font-weight:700;font-size:14px;cursor:pointer}
  .dlg-b.cancel{background:var(--surface-2);color:var(--ink)}
  .dlg-b.ok{background:var(--blue);color:#fff}
  .dlg-b.danger{background:var(--danger);color:#fff}
  h1,h2,h3{margin:0;line-height:1.1;font-weight:700;letter-spacing:-.02em}
  .app-head{display:flex;align-items:baseline;justify-content:space-between;padding:26px 2px 18px}
  .brand{font-size:26px;font-weight:800;letter-spacing:-.03em}
  .brand span{color:var(--blue)}
  .tagline{font-size:12.5px;color:var(--muted-2)}

  .card{background:var(--surface);border-radius:var(--radius);padding:20px}
  .greeting h2{font-size:23px;margin-bottom:4px}
  .greeting p{margin:0;color:var(--muted);font-size:14px}
  .week{display:flex;justify-content:space-between;margin-top:16px;gap:6px}
  .day{flex:1;text-align:center}
  .day .dot{width:34px;height:34px;border-radius:50%;margin:0 auto 5px;display:flex;align-items:center;justify-content:center;background:var(--surface-2);border:1.5px solid var(--line);font-size:12px;color:var(--muted-2);transition:.2s}
  .day.done .dot{background:var(--blue);border-color:var(--blue);color:#fff}
  .day.today .dot{border-color:var(--blue);border-style:dashed}
  .day .lbl{font-size:11px;color:var(--muted-2);font-weight:500}

  .actions{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .action{border:none;cursor:pointer;border-radius:var(--radius);padding:18px 16px;text-align:left;font-family:inherit;transition:transform .12s ease}
  .action:active{transform:scale(.98)}
  .action .ico{width:24px;height:24px;display:block;margin-bottom:10px}
  .action .t{font-size:15px;font-weight:700;letter-spacing:-.01em}
  .action .s{font-size:12px;opacity:.7;margin-top:2px}
  .action.strength{background:var(--blue);color:#fff}
  .action.cardio{background:var(--surface);color:var(--ink)}
  .action.cardio .s{color:var(--muted)}

  .sec-title{font-size:12.5px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin:26px 2px 12px}

  .exthumb{width:38px;height:38px;border-radius:11px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .exthumb svg{width:30px;height:30px}

  .routine{background:var(--surface);border-radius:var(--radius);padding:16px;margin-bottom:12px}
  .routine .rtop{display:flex;align-items:flex-start;justify-content:space-between;cursor:pointer}
  .routine .rn{font-weight:700;font-size:16.5px;letter-spacing:-.01em}
  .routine .rx{font-size:12.5px;color:var(--muted-2);margin-top:4px;line-height:1.4}
  .routine .chev{color:var(--muted-2);font-size:20px;line-height:1;padding-left:8px}
  .routine .rstart{width:100%;margin-top:13px;background:var(--blue-dim);color:#79AEFF;border:none;border-radius:11px;padding:12px;font-family:inherit;font-weight:700;font-size:14.5px;cursor:pointer}
  .routine .rstart:active{transform:scale(.99)}
  .routine .rview{background:var(--surface-2);color:var(--ink);border:none;border-radius:11px;padding:12px 18px;font-family:inherit;font-weight:700;font-size:14.5px;cursor:pointer}
  .routine .rview:active{transform:scale(.99)}

  .add-routine{width:100%;background:none;border:1.6px dashed var(--line);border-radius:var(--radius);padding:16px;color:var(--blue);font-family:inherit;font-weight:700;font-size:14.5px;cursor:pointer;margin-bottom:12px}
  .add-routine:active{background:var(--surface)}

  .routines-head{display:flex;align-items:center;justify-content:space-between;margin:26px 2px 12px}
  .routines-head .t{font-size:12.5px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.07em}
  .routines-head .nf{background:none;border:none;color:var(--blue);font-family:inherit;font-weight:700;font-size:12.5px;cursor:pointer;padding:2px 4px}
  .folder{border:1px solid var(--line);border-radius:14px;margin-bottom:12px;overflow:hidden}
  .folder-head{display:flex;align-items:center;gap:11px;padding:13px 14px;background:var(--surface-2);cursor:pointer}
  .folder-head .fchev{color:var(--muted-2);font-size:11px;transition:transform .15s;display:inline-block;width:10px}
  .folder.open .fchev{transform:rotate(90deg)}
  .folder-head .ficon{color:var(--blue);display:flex}
  .folder-head .ficon svg{width:18px;height:18px}
  .folder-head .fname{font-weight:700;font-size:15.5px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .folder-head .fcount{color:var(--muted-2);font-size:12.5px;font-weight:700;background:var(--bg);padding:2px 10px;border-radius:20px}
  .folder-head .fmenu{background:none;border:none;color:var(--muted-2);font-size:19px;cursor:pointer;padding:0 4px;line-height:1}
  .folder-body{padding:12px}
  .folder-body .routine-list{margin:0}
  .folder-empty{color:var(--muted-2);font-size:13px;padding:4px 4px 2px;line-height:1.4}
  .folder-label{font-size:12.5px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin:22px 2px 12px;padding-top:6px;border-top:1px solid var(--line)}

  .sess{display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--surface);border-radius:14px}
  .sess + .sess{margin-top:9px}
  .sess .badge{width:40px;height:40px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--surface-2)}
  .sess .badge svg{width:20px;height:20px}
  .sess .meta{flex:1;min-width:0}
  .sess .meta .h{font-weight:700;font-size:14.5px;letter-spacing:-.01em}
  .sess .meta .d{font-size:12.5px;color:var(--muted-2);margin-top:1px}

  .empty{text-align:center;color:var(--muted-2);padding:34px 20px;font-size:14px}
  .empty .big{font-size:18px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px}

  .nav{position:fixed;bottom:0;left:0;right:0;background:rgba(10,10,12,.9);backdrop-filter:blur(14px);border-top:1px solid var(--line);display:flex;justify-content:center;gap:8px;padding:9px 0 max(9px,env(safe-area-inset-bottom))}
  .nav button{border:none;background:none;cursor:pointer;font-family:inherit;color:var(--muted-2);font-size:11px;font-weight:600;display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 26px;border-radius:12px}
  .nav button svg{width:22px;height:22px}
  .nav button.on{color:var(--blue)}

  .screen{position:fixed;inset:0;background:var(--bg);z-index:40;overflow-y:auto;transform:translateY(100%);transition:transform .28s cubic-bezier(.32,.72,0,1);opacity:0}
  .screen.open{transform:translateY(0);opacity:1}
  .screen-in{max-width:520px;margin:0 auto;padding:0 18px 40px}
  .screen-head{display:flex;align-items:center;justify-content:space-between;padding:16px 2px;position:sticky;top:0;background:var(--bg);z-index:2;gap:10px}
  .screen-head h2{font-size:19px;flex:1;text-align:center}
  .link{background:none;border:none;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;color:var(--muted);padding:6px;white-space:nowrap}
  .link.done{color:var(--blue)}
  .link.iconbtn{padding:6px;display:flex;align-items:center;justify-content:center;color:var(--ink)}
  .hd-ico{width:22px;height:22px}

  .wknav{display:flex;align-items:center;justify-content:space-between;margin:4px 0 16px}
  .wkbtn{background:var(--surface);border:none;color:var(--ink);width:38px;height:38px;border-radius:11px;font-size:16px;cursor:pointer}
  .wklbl{text-align:center}
  .wklbl .wkw{font-weight:700;font-size:15px}
  .wklbl .wkr{font-size:12px;color:var(--muted-2);margin-top:1px}
  .grp-card{background:var(--surface);border-radius:14px;padding:15px 16px;margin-bottom:11px}
  .grp-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}
  .grp-name{font-weight:700;font-size:16px}
  .grp-status{font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px}
  .grp-status.under{background:rgba(255,159,107,.16);color:var(--sec)}
  .grp-status.ontrack{background:rgba(48,209,88,.16);color:var(--green)}
  .grp-status.over{background:var(--blue-dim);color:#79AEFF}
  .grp-row{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:9px}
  .grp-sets{font-size:20px;font-weight:800;letter-spacing:-.02em}
  .grp-range{font-size:13px;color:var(--muted-2);font-weight:600}
  .grp-bar{height:7px;background:var(--surface-2);border-radius:5px;overflow:hidden;margin-bottom:11px}
  .grp-fill{height:100%;border-radius:5px;background:var(--sec)}
  .grp-fill.ontrack{background:var(--green)}
  .grp-fill.over{background:var(--blue)}
  .grp-reps{display:flex;justify-content:space-between;font-size:12.5px;color:var(--muted);padding-top:11px;border-top:1px solid var(--line)}
  .grp-edit{margin-top:12px;background:var(--surface-2);border:none;color:var(--blue);font-family:inherit;font-weight:700;font-size:13px;padding:9px 14px;border-radius:9px;cursor:pointer}
  .body-list{margin-top:2px}
  .bl-row{display:flex;justify-content:space-between;padding:13px 4px;font-size:15px;border-bottom:1px solid var(--line)}
  .bl-row span:last-child{font-weight:700}
  .bl-row.bl-total{font-weight:800}
  .trend-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}
  .trend-card{background:var(--surface);border-radius:14px;padding:16px}
  .trend-card .tc-label{font-size:14px;color:var(--ink);margin-bottom:8px}
  .trend-card .tc-val{font-size:26px;font-weight:800;letter-spacing:-.02em}
  .trend-card .tc-prev{font-size:12.5px;font-weight:700;margin-top:4px}
  .link.danger{color:var(--danger)}
  .timer{background:var(--surface-2);color:var(--blue);font-weight:700;font-size:15px;padding:7px 16px;border-radius:20px;font-variant-numeric:tabular-nums}

  .bodymap{display:flex;gap:16px;justify-content:center;margin:8px 0 4px}
  .bodyview{text-align:center}
  .bodyview svg{width:130px;height:231px;display:block;margin:0 auto}
  .bvlabel{font-size:11px;color:var(--muted-2);font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
  .bodymap .sil{fill:#3A3A3E}
  .mlegend{display:flex;gap:18px;justify-content:center;margin:4px 0 8px}
  .mlg{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--muted);font-weight:600}
  .mlg .sw{width:12px;height:12px;border-radius:3px;display:inline-block}
  .bodymap .m{fill:transparent;transition:fill .18s}
  .mus-list-head{display:flex;justify-content:space-between;font-size:10.5px;color:var(--muted-2);font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin:18px 2px 10px}
  .mus-row{display:flex;align-items:center;gap:11px;margin-bottom:10px}
  .mus-name{font-size:13px;width:90px;flex-shrink:0;color:var(--ink)}
  .mus-bar{flex:1;height:8px;background:var(--surface-2);border-radius:5px;overflow:hidden}
  .mus-fill{height:100%;background:var(--blue);border-radius:5px}
  .mus-val{font-size:12.5px;color:var(--muted);font-weight:700;width:34px;text-align:right}

  .dset-line{display:flex;align-items:center;gap:12px;font-size:14px;padding:6px 2px;color:var(--ink)}
  .dset-line .sn{color:var(--muted-2);font-weight:700;font-size:12px;width:16px;text-align:center}
  .dset-line .donetick{margin-left:auto;color:var(--green);font-weight:700}

  .histset{margin-top:4px}
  .histset-head{display:grid;grid-template-columns:52px 1fr;font-size:10.5px;color:var(--muted-2);font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:0 12px 8px}
  .histset-row{display:grid;grid-template-columns:52px 1fr;align-items:center;padding:14px 12px;font-size:16px;border-radius:8px}
  .histset-rows .histset-row:nth-child(even){background:var(--surface)}
  .histset-row .hs-set{font-weight:700;color:var(--ink)}
  .histset-row .hs-body{color:var(--ink)}
  .histset-row .hs-w{display:inline-block;min-width:58px}
  .histset-row .hs-x{color:var(--muted-2)}

  .detabs{display:flex;gap:6px;margin:10px 0 18px}
  .detab{flex:1;background:var(--surface);border:none;color:var(--muted);font-family:inherit;font-weight:700;font-size:13.5px;padding:10px;border-radius:10px;cursor:pointer}
  .detab.on{background:var(--blue);color:#fff}
  .pr{display:flex;justify-content:space-between;align-items:baseline;padding:15px 2px;border-bottom:1px solid var(--line);font-size:15px}
  .pr .prl{color:var(--ink)}
  .pr .prv{color:var(--blue);font-weight:700;font-size:16px}
  .hist-entry{margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--line)}
  .hist-top{margin-bottom:10px}
  .hist-top .ht{font-weight:700;font-size:16px;letter-spacing:-.01em}
  .hist-top .hd{font-size:12.5px;color:var(--muted-2);margin-top:2px}
  .hist-head{display:flex;justify-content:space-between;font-size:10.5px;color:var(--muted-2);font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;padding:0 2px}

  .field{margin-bottom:16px}
  .field label{display:block;font-size:12.5px;font-weight:600;color:var(--muted);margin-bottom:7px}
  input,select,textarea{width:100%;font-family:inherit;font-size:16px;padding:13px 14px;border:1.5px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink);outline:none}
  input:focus,select:focus,textarea:focus{border-color:var(--blue)}
  input[type=number]{-moz-appearance:textfield}
  textarea{resize:vertical;min-height:74px;line-height:1.4}
  ::placeholder{color:var(--muted-2)}

  .chips{display:flex;flex-wrap:wrap;gap:8px}
  .chip{border:1.5px solid var(--line);background:var(--surface);border-radius:20px;padding:9px 15px;font-family:inherit;font-size:13.5px;font-weight:600;color:var(--muted);cursor:pointer;transition:.12s}
  .chip.on{background:var(--blue);border-color:var(--blue);color:#fff}
  .chip.small{padding:7px 12px;font-size:12.5px}

  .ex{background:var(--surface);border-radius:var(--radius);padding:16px;margin-bottom:12px}
  .ex-head{display:flex;align-items:center;gap:12px;margin-bottom:8px}
  .ex-head .n{font-weight:700;font-size:15.5px;letter-spacing:-.01em;flex:1}
  .ex-head .rm{background:none;border:none;color:var(--muted-2);cursor:pointer;font-size:19px;line-height:1;padding:2px 6px}
  .ex .prev{font-size:11.5px;color:var(--muted-2);margin:-2px 0 10px 50px}
  .set-row{display:grid;grid-template-columns:24px 1fr 1fr 32px 22px;gap:8px;align-items:center;margin-bottom:7px}
  .set-row .sn{font-size:12px;color:var(--muted-2);font-weight:700;text-align:center}
  .set-row input{padding:9px 8px;font-size:15px;text-align:center;background:var(--surface-2);border-color:var(--surface-2)}
  .set-row.done input{background:rgba(48,209,88,.10);border-color:rgba(48,209,88,.30)}
  .chk{width:32px;height:32px;border-radius:9px;border:1.6px solid var(--line);background:transparent;color:var(--muted-2);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
  .chk svg{width:15px;height:15px}
  .chk.on{background:var(--green);border-color:var(--green);color:#04310F}
  .dset{background:none;border:none;color:var(--muted-2);font-size:16px;cursor:pointer;padding:0}
  .set-row.cardio{grid-template-columns:24px 1fr 32px 22px}
  .set-head.cardio{grid-template-columns:24px 1fr 32px 22px}
  .set-head{display:grid;grid-template-columns:24px 1fr 1fr 32px 22px;gap:8px;font-size:10.5px;color:var(--muted-2);font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;padding:0 2px}
  .set-head span:first-child{text-align:center}
  .set-head span{text-align:center}
  .add-set{width:100%;background:var(--surface-2);border:none;border-radius:10px;padding:10px;font-family:inherit;font-weight:700;font-size:13px;color:var(--blue);cursor:pointer;margin-top:4px}
  .btn{width:100%;border:none;border-radius:14px;padding:16px;font-family:inherit;font-weight:700;font-size:15.5px;cursor:pointer}
  .btn.primary{background:var(--blue);color:#fff}
  .btn.primary[disabled]{opacity:.4}
  .btn.ghost{background:var(--surface);color:var(--blue);margin-top:10px}
  .btn:active{transform:scale(.99)}

  .picker-group{margin-bottom:18px}
  .picker-group .g{font-size:12px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.07em;margin-bottom:9px}
  .picker-item{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:var(--surface);border:1.5px solid var(--line);border-radius:12px;padding:10px 13px;font-family:inherit;font-size:15px;font-weight:500;color:var(--ink);cursor:pointer;margin-bottom:8px}
  .picker-item:active{background:var(--surface-2)}

  .sum-stats{display:flex;gap:10px;margin:8px 0 18px;padding-bottom:18px;border-bottom:1px solid var(--line)}
  .sum-stats .s{flex:1}
  .sum-stats .lbl{font-size:11.5px;color:var(--muted-2);font-weight:600;text-transform:uppercase;letter-spacing:.05em}
  .sum-stats .val{font-size:24px;font-weight:800;letter-spacing:-.02em;margin-top:4px}
  .sum-stats .val.blue{color:var(--blue)}

  .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:6px}
  .stat{background:var(--surface);border-radius:var(--radius);padding:18px}
  .stat .num{font-size:30px;font-weight:800;letter-spacing:-.02em;line-height:1}
  .stat .lbl{font-size:12.5px;color:var(--muted);margin-top:6px}
  .note{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:15px 17px;font-size:13.5px;color:var(--muted);display:flex;gap:12px;align-items:flex-start;margin-top:14px;line-height:1.45}
  .note svg{flex-shrink:0;margin-top:1px;color:var(--blue)}
  .bars{display:flex;align-items:flex-end;gap:6px;height:90px;margin:14px 0 6px}
  .bars .b{flex:1;background:var(--blue-dim);border-radius:6px 6px 3px 3px;position:relative;min-height:4px;transition:.3s}
  .bars .b.hi{background:var(--blue)}
  .bars .b .cap{position:absolute;top:-18px;left:0;right:0;text-align:center;font-size:10.5px;color:var(--muted-2);font-weight:700}
  .bars-x{display:flex;gap:6px}
  .bars-x span{flex:1;text-align:center;font-size:10px;color:var(--muted-2)}
  .select-ex{margin-bottom:14px}
  .line-wrap{overflow-x:auto}
  .detail-ex{display:flex;align-items:center;gap:13px;background:var(--surface);border-radius:14px;padding:13px 15px;margin-bottom:9px}
  .detail-ex .dn{font-weight:700;font-size:14.5px}
  .detail-ex .dd{font-size:12px;color:var(--muted-2);margin-top:1px}

  .rex-header{display:flex;align-items:center;justify-content:space-between;margin:8px 2px 16px}
  .rex-title{color:var(--muted);font-size:15px;font-weight:600}
  .rex-edit{background:none;border:none;color:var(--blue);font-family:inherit;font-weight:700;font-size:14px;cursor:pointer;padding:0}
  .rex{margin-bottom:24px}
  .rex-head{display:flex;align-items:center;gap:13px;margin-bottom:8px}
  .rex-namewrap{display:flex;align-items:center;gap:10px;flex-wrap:wrap;min-width:0}
  .rex-name{color:var(--blue);font-weight:700;font-size:16.5px;letter-spacing:-.01em}
  .custom-badge{background:var(--surface-2);color:var(--muted);font-size:11px;font-weight:700;padding:3px 10px;border-radius:6px;white-space:nowrap}
  .rtable{margin-top:2px}
  .rtable-head{display:grid;grid-template-columns:52px 1fr 1fr;font-size:10.5px;color:var(--muted-2);font-weight:700;text-transform:uppercase;letter-spacing:.07em;padding:0 6px 8px}
  .rtable-head.cardio{grid-template-columns:52px 1fr}
  .rtable-row{display:grid;grid-template-columns:52px 1fr 1fr;align-items:center;padding:13px 6px;font-size:16px;border-radius:8px}
  .rtable-row.cardio{grid-template-columns:52px 1fr}
  .rtable-rows .rtable-row:nth-child(even){background:var(--surface)}
  .rtable-row .rt-set{font-weight:700;color:var(--ink)}
  .rtable-row .rt-v{color:var(--muted)}

  /* columns: block on mobile, side-by-side on wide screens */
  .cols{display:block}
  .col{min-width:0}

  /* ---------- tablet / laptop ---------- */
  @media (min-width:768px){
    .wrap{max-width:720px;padding-bottom:120px}
    .app-head{padding-top:34px}
    .brand{font-size:30px}

    /* bottom bar becomes a floating centered pill */
    .nav{left:50%;right:auto;transform:translateX(-50%);width:auto;bottom:22px;
      border:1px solid var(--line);border-top:1px solid var(--line);border-radius:999px;
      padding:6px;background:rgba(24,24,26,.94);box-shadow:0 10px 34px rgba(0,0,0,.55)}
    .nav button{flex-direction:row;gap:9px;padding:9px 20px;border-radius:999px}
    .nav button svg{width:19px;height:19px}
    .nav button.on{background:var(--surface-2)}

    /* log screens become centered modals with a dimmed backdrop */
    .screen{background:rgba(0,0,0,.6);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);
      display:flex;align-items:center;justify-content:center;transform:none;opacity:0;
      pointer-events:none;transition:opacity .22s ease}
    .screen.open{transform:none;opacity:1;pointer-events:auto}
    .screen-in{width:560px;max-width:calc(100vw - 48px);max-height:88vh;overflow-y:auto;
      background:var(--bg);border:1px solid var(--line);border-radius:22px;padding:6px 24px 30px}
    .screen-head{border-radius:22px 22px 0 0}
  }

  /* ---------- wider laptop: two columns ---------- */
  @media (min-width:1000px){
    .wrap{max-width:1000px}
    .cols{display:grid;grid-template-columns:360px 1fr;gap:26px;align-items:start}
    .cols .col>*:first-child{margin-top:0}
    .col .sec-title{margin-top:22px}
    .col>.sec-title:first-child{margin-top:0}
    .routine-list{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .routine-list .routine{margin-bottom:0}
  }

  @media (min-width:1280px){
    .wrap{max-width:1120px}
    .cols{grid-template-columns:380px 1fr}
  }

  /* mouse hover niceties (skipped on touch) */
  @media (hover:hover){
    .action:hover{filter:brightness(1.08)}
    .routine{transition:border-color .15s}
    .routine:hover{outline:1px solid var(--line)}
    .picker-item:hover{background:var(--surface-2)}
    .sess:hover{background:var(--surface-2)}
    .chip:hover{border-color:var(--muted-2)}
    .nav button:hover{color:var(--ink)}
    .add-routine:hover{background:var(--surface)}
  }
</style>
</head>
<body>

<div class="wrap" id="app"></div>

<nav class="nav" id="nav">
  <button data-tab="workout" class="on">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5l11 11"/><rect x="1.7" y="8.2" width="3.5" height="7.6" rx="1" transform="rotate(-45 3.4 12)"/><rect x="18.8" y="8.2" width="3.5" height="7.6" rx="1" transform="rotate(-45 20.6 12)"/></svg>
    Workout
  </button>
  <button data-tab="progress">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15l4-5 3 3 4-6"/></svg>
    Progress
  </button>
  <button data-tab="stats">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="12" width="4" height="8" rx="1"/><rect x="10" y="7" width="4" height="13" rx="1"/><rect x="17" y="4" width="4" height="16" rx="1"/></svg>
    Statistics
  </button>
</nav>

<div class="screen" id="logScreen"><div class="screen-in" id="logInner"></div></div>

<script>
"use strict";

var STORE_KEY="steady:data:v1";
var state={ sessions:[], customExercises:[], routines:[], folders:[], customData:{} };

var LIBRARY={
  "Chest":["Bench Press","Incline Bench Press","Decline Bench Press","Dumbbell Bench Press","Chest Fly","Pec Deck","Push-up","Chest Dip","Cable Fly","Floor Press"],
  "Shoulders":["Shoulder Press","Arnold Press","Lateral Raise","Front Raise","Rear Delt Fly","Face Pull","Upright Row","Handstand Push-up"],
  "Biceps":["Barbell Curl","Dumbbell Curl","Hammer Curl","Concentration Curl","Incline Curl","Preacher Curl","Cable Curl","Spider Curl"],
  "Triceps":["Tricep Pushdown","Overhead Extension","Skullcrusher","Close Grip Bench Press","Bench Dips","Tricep Kickback","Rope Pushdown","One-arm Extension"],
  "Lats":["Lat Pulldown","Pull-up","Chin-up","Straight-arm Pulldown","Machine Pulldown"],
  "Upper Back":["Barbell Row","Dumbbell Row","Seated Cable Row","Chest Supported Row","Pendlay Row","T-Bar Row","Inverted Row"],
  "Lower Back":["Back Extension","Good Morning","Romanian Deadlift","Deadlift","Superman"],
  "Glutes":["Hip Thrust","Glute Bridge","Cable Kickback","Donkey Kick","Bulgarian Split Squat","Step-up","Glute Machine","Lateral Leg Raise"],
  "Quadriceps":["Squat","Front Squat","Hack Squat","Leg Press","Leg Extension","Goblet Squat","Walking Lunge","Reverse Lunge"],
  "Hamstrings":["Stiff Leg Deadlift","Lying Leg Curl","Seated Leg Curl","Nordic Curl","Single-leg RDL"],
  "Calves":["Standing Calf Raise","Seated Calf Raise","Donkey Calf Raise","Single-leg Calf Raise"],
  "Core":["Crunch","Cable Crunch","Hanging Leg Raise","Reverse Crunch","Russian Twist","Plank","Bicycle Crunch","Heel Taps","Mountain Climbers","Ab Wheel Rollout"],
  "Forearms":["Wrist Curl","Reverse Wrist Curl","Farmer's Walk","Plate Pinch","Behind-the-back Wrist Curl"],
  "Traps":["Barbell Shrug","Dumbbell Shrug"],
  "Neck":["Neck Flexion","Neck Extension","Neck Lateral Flexion"],
  "Olympic":["Clean","Clean & Jerk","Snatch","Hang Clean","Hang Snatch","Push Press","Thruster","Overhead Squat"]
};
var CARDIO=["StairMaster","Walking","Running","Cycling","Rowing","Elliptical","Swimming"];

var EX_KEY={
  "Bench Press":"bench","Incline Bench Press":"bench","Decline Bench Press":"bench","Dumbbell Bench Press":"bench","Chest Fly":"bench","Pec Deck":"bench","Push-up":"pushup","Chest Dip":"pushup","Cable Fly":"bench","Floor Press":"bench",
  "Shoulder Press":"ohp","Arnold Press":"ohp","Lateral Raise":"lateral","Front Raise":"lateral","Rear Delt Fly":"lateral","Face Pull":"row","Upright Row":"row","Handstand Push-up":"ohp",
  "Barbell Curl":"curl","Dumbbell Curl":"curl","Hammer Curl":"curl","Concentration Curl":"curl","Incline Curl":"curl","Preacher Curl":"curl","Cable Curl":"curl","Spider Curl":"curl",
  "Tricep Pushdown":"pushdown","Overhead Extension":"pushdown","Skullcrusher":"bench","Close Grip Bench Press":"bench","Bench Dips":"pushup","Tricep Kickback":"pushdown","Rope Pushdown":"pushdown","One-arm Extension":"pushdown",
  "Lat Pulldown":"pulldown","Pull-up":"pullup","Chin-up":"pullup","Straight-arm Pulldown":"pulldown","Machine Pulldown":"pulldown",
  "Barbell Row":"row","Dumbbell Row":"row","Seated Cable Row":"row","Chest Supported Row":"row","Pendlay Row":"row","T-Bar Row":"row","Inverted Row":"row",
  "Back Extension":"hinge","Good Morning":"hinge","Romanian Deadlift":"hinge","Deadlift":"hinge","Superman":"plank",
  "Hip Thrust":"hipthrust","Glute Bridge":"hipthrust","Cable Kickback":"hipthrust","Donkey Kick":"hipthrust","Bulgarian Split Squat":"lunge","Step-up":"lunge","Glute Machine":"hipthrust","Lateral Leg Raise":"lateral",
  "Squat":"squat","Front Squat":"squat","Hack Squat":"squat","Leg Press":"squat","Leg Extension":"seated","Goblet Squat":"squat","Walking Lunge":"lunge","Reverse Lunge":"lunge",
  "Stiff Leg Deadlift":"hinge","Lying Leg Curl":"seated","Seated Leg Curl":"seated","Nordic Curl":"hinge","Single-leg RDL":"hinge",
  "Standing Calf Raise":"calf","Seated Calf Raise":"calf","Donkey Calf Raise":"calf","Single-leg Calf Raise":"calf",
  "Crunch":"plank","Cable Crunch":"plank","Hanging Leg Raise":"pullup","Reverse Crunch":"plank","Russian Twist":"plank","Plank":"plank","Bicycle Crunch":"plank","Heel Taps":"plank","Mountain Climbers":"plank","Ab Wheel Rollout":"plank",
  "Wrist Curl":"curl","Reverse Wrist Curl":"curl","Farmer's Walk":"walk","Plate Pinch":"dumbbell","Behind-the-back Wrist Curl":"curl",
  "Barbell Shrug":"dumbbell","Dumbbell Shrug":"dumbbell",
  "Neck Flexion":"dumbbell","Neck Extension":"dumbbell","Neck Lateral Flexion":"dumbbell",
  "Clean":"hinge","Clean & Jerk":"ohp","Snatch":"ohp","Hang Clean":"hinge","Hang Snatch":"ohp","Push Press":"ohp","Thruster":"squat","Overhead Squat":"squat",
  "StairMaster":"stairs","Walking":"walk","Running":"run","Cycling":"cycle","Rowing":"row","Elliptical":"run","Swimming":"swim"
};
var EX_ART={
  squat:'<circle cx="24" cy="9" r="2.6"/><path d="M14 15h20"/><path d="M13 12.5v5M35 12.5v5"/><path d="M24 12v9"/><path d="M24 14l-7-.6M24 14l7-.6"/><path d="M24 21l-5 6v10M24 21l5 6v10"/>',
  hinge:'<circle cx="14" cy="14" r="2.6"/><path d="M16 16l13 6"/><path d="M29 22v15"/><path d="M23 19v12"/><path d="M18 31h10"/><path d="M17.5 29v4M28.5 29v4"/>',
  ohp:'<circle cx="24" cy="13" r="2.6"/><path d="M24 16v11"/><path d="M24 27l-4 10M24 27l4 10"/><path d="M16 7h16"/><path d="M14.5 4.5v5M33.5 4.5v5"/><path d="M24 16l-6-8M24 16l6-8"/>',
  bench:'<path d="M8 35h28"/><circle cx="13" cy="29" r="2.6"/><path d="M16 30h13"/><path d="M29 30l5 4"/><path d="M20 30v-7M27 30v-7"/><path d="M17 23h13"/><path d="M16 21v4M31 21v4"/>',
  pushup:'<path d="M7 35h32"/><circle cx="12" cy="27" r="2.6"/><path d="M14 28l17 4"/><path d="M15 29v6M31 33v2"/><path d="M31 33l6 2"/>',
  row:'<circle cx="15" cy="14" r="2.6"/><path d="M17 16l12 4"/><path d="M29 20v16"/><path d="M23 18v9"/><path d="M20 27h8"/><path d="M19.5 25v4M28.5 25v4"/>',
  pulldown:'<circle cx="24" cy="22" r="2.6"/><path d="M24 25v9"/><path d="M24 34l-4 4M24 34l4 4"/><path d="M15 10h18"/><path d="M24 25l-7-14M24 25l7-14"/>',
  pullup:'<path d="M11 8h26"/><circle cx="24" cy="18" r="2.6"/><path d="M24 21v10"/><path d="M24 31l-3 6M24 31l3 6"/><path d="M24 15l-6-7M24 15l6-7"/>',
  curl:'<circle cx="24" cy="10" r="2.6"/><path d="M24 13v13"/><path d="M24 26l-4 11M24 26l4 11"/><path d="M20 16l2-4M28 16l-2-4"/><circle cx="21.5" cy="11" r="1.7" fill="currentColor"/><circle cx="26.5" cy="11" r="1.7" fill="currentColor"/>',
  pushdown:'<circle cx="24" cy="10" r="2.6"/><path d="M24 13v13"/><path d="M24 26l-4 11M24 26l4 11"/><path d="M24 16l-4 8M24 16l4 8"/><path d="M18 24h12"/>',
  lateral:'<circle cx="24" cy="10" r="2.6"/><path d="M24 13v14"/><path d="M24 27l-4 10M24 27l4 10"/><path d="M24 16l-9 2M24 16l9 2"/><circle cx="13.5" cy="18.5" r="1.7" fill="currentColor"/><circle cx="34.5" cy="18.5" r="1.7" fill="currentColor"/>',
  lunge:'<circle cx="22" cy="9" r="2.6"/><path d="M22 12v11"/><path d="M22 23l-8 6v8"/><path d="M22 23l7 5 5 9"/><path d="M16 15h12"/><path d="M15 12.5v5M29 12.5v5"/>',
  hipthrust:'<path d="M6 26h9"/><circle cx="9" cy="22" r="2.6"/><path d="M11 24l11 4"/><path d="M22 28l3-6"/><path d="M25 22v13"/><path d="M20 35h11"/>',
  calf:'<circle cx="24" cy="11" r="2.6"/><path d="M18 11h12"/><path d="M24 14v14"/><path d="M24 28l-3 8M24 28l3 8"/><path d="M18 37h5M25 37h5"/>',
  plank:'<path d="M7 35h32"/><circle cx="12" cy="27" r="2.6"/><path d="M14 29l18 3"/><path d="M16 30v5M32 32v3"/>',
  seated:'<circle cx="15" cy="16" r="2.6"/><path d="M15 19v8"/><path d="M15 27h11"/><path d="M26 27l7-6"/><path d="M11 27h4"/><path d="M31 20v4"/>',
  stairs:'<path d="M7 38h8v-6h8v-6h8v-6h8"/><circle cx="17" cy="16" r="2.6"/><path d="M17 19v7"/><path d="M17 26l4 6M17 26l-3 5"/><path d="M17 21l6 2"/>',
  walk:'<circle cx="24" cy="9" r="2.6"/><path d="M24 12v11"/><path d="M24 23l-4 8M24 23l5 7"/><path d="M24 15l4 3M24 15l-4 -1"/>',
  run:'<circle cx="27" cy="9" r="2.6"/><path d="M27 12l-4 9"/><path d="M23 21l7 6M23 21l-5 7"/><path d="M26 15l6 3M26 15l-6 -1"/>',
  cycle:'<circle cx="14" cy="34" r="5"/><circle cx="34" cy="34" r="5"/><path d="M14 34l8 -11h6M22 23l12 11"/><circle cx="28" cy="16" r="2.6"/><path d="M28 19l0 7"/>',
  swim:'<path d="M5 32q6 -4 11 0t11 0 11 0"/><circle cx="20" cy="19" r="2.6"/><path d="M22 20l11 3"/><path d="M22 19l-5 -6"/>',
  dumbbell:'<path d="M11 24h26"/><path d="M14 18v12M9 20.5v7M34 18v12M39 20.5v7"/>'
};
function artInner(name){ return EX_ART[EX_KEY[name]] || EX_ART.dumbbell; }
function thumb(name){ return '<div class="exthumb"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" style="color:var(--thumb)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'+artInner(name)+'</svg></div>'; }
var CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

/* ---------- exercise muscle classification ----------
   format: name -> [primaryCSV, secondaryCSV, region, movement, type]   */
var EXDATA={
  "Bench Press":["chest","shoulders_front,triceps","Upper body","Push","compound"],
  "Incline Bench Press":["chest","shoulders_front,triceps","Upper body","Push","compound"],
  "Decline Bench Press":["chest","triceps,shoulders_front","Upper body","Push","compound"],
  "Dumbbell Bench Press":["chest","shoulders_front,triceps","Upper body","Push","compound"],
  "Chest Fly":["chest","shoulders_front","Upper body","Push","isolation"],
  "Pec Deck":["chest","","Upper body","Push","isolation"],
  "Push-up":["chest","triceps,shoulders_front,abs","Upper body","Push","compound"],
  "Chest Dip":["chest","triceps,shoulders_front","Upper body","Push","compound"],
  "Cable Fly":["chest","shoulders_front","Upper body","Push","isolation"],
  "Floor Press":["chest","triceps,shoulders_front","Upper body","Push","compound"],
  "Shoulder Press":["shoulders_front,shoulders_side","triceps,traps","Upper body","Push","compound"],
  "Arnold Press":["shoulders_front,shoulders_side","triceps,shoulders_rear","Upper body","Push","compound"],
  "Lateral Raise":["shoulders_side","","Upper body","Isolation","isolation"],
  "Front Raise":["shoulders_front","","Upper body","Isolation","isolation"],
  "Rear Delt Fly":["shoulders_rear","upper_back","Upper body","Pull","isolation"],
  "Face Pull":["shoulders_rear","upper_back,traps","Upper body","Pull","compound"],
  "Upright Row":["shoulders_side,traps","biceps","Upper body","Pull","compound"],
  "Handstand Push-up":["shoulders_front,shoulders_side","triceps,traps","Upper body","Push","compound"],
  "Barbell Curl":["biceps","forearms","Upper body","Pull","isolation"],
  "Dumbbell Curl":["biceps","forearms","Upper body","Pull","isolation"],
  "Hammer Curl":["biceps,forearms","","Upper body","Pull","isolation"],
  "Concentration Curl":["biceps","","Upper body","Pull","isolation"],
  "Incline Curl":["biceps","","Upper body","Pull","isolation"],
  "Preacher Curl":["biceps","forearms","Upper body","Pull","isolation"],
  "Cable Curl":["biceps","forearms","Upper body","Pull","isolation"],
  "Spider Curl":["biceps","","Upper body","Pull","isolation"],
  "Tricep Pushdown":["triceps","","Upper body","Push","isolation"],
  "Overhead Extension":["triceps","","Upper body","Push","isolation"],
  "Skullcrusher":["triceps","","Upper body","Push","isolation"],
  "Close Grip Bench Press":["triceps","chest,shoulders_front","Upper body","Push","compound"],
  "Bench Dips":["triceps","chest,shoulders_front","Upper body","Push","compound"],
  "Tricep Kickback":["triceps","","Upper body","Push","isolation"],
  "Rope Pushdown":["triceps","","Upper body","Push","isolation"],
  "One-arm Extension":["triceps","","Upper body","Push","isolation"],
  "Lat Pulldown":["lats","biceps,upper_back","Upper body","Pull","compound"],
  "Pull-up":["lats","biceps,upper_back","Upper body","Pull","compound"],
  "Chin-up":["lats,biceps","upper_back","Upper body","Pull","compound"],
  "Straight-arm Pulldown":["lats","","Upper body","Pull","isolation"],
  "Machine Pulldown":["lats","biceps,upper_back","Upper body","Pull","compound"],
  "Barbell Row":["upper_back,lats","biceps,shoulders_rear","Upper body","Pull","compound"],
  "Dumbbell Row":["upper_back,lats","biceps,shoulders_rear","Upper body","Pull","compound"],
  "Seated Cable Row":["upper_back,lats","biceps,shoulders_rear","Upper body","Pull","compound"],
  "Chest Supported Row":["upper_back,lats","biceps,shoulders_rear","Upper body","Pull","compound"],
  "Pendlay Row":["upper_back,lats","biceps,lower_back","Upper body","Pull","compound"],
  "T-Bar Row":["upper_back,lats","biceps","Upper body","Pull","compound"],
  "Inverted Row":["upper_back,lats","biceps","Upper body","Pull","compound"],
  "Back Extension":["lower_back","glutes,hamstrings","Posterior chain","Hinge","isolation"],
  "Good Morning":["lower_back,hamstrings","glutes","Posterior chain","Hinge","compound"],
  "Romanian Deadlift":["hamstrings,glutes","lower_back","Posterior chain","Hinge","compound"],
  "Deadlift":["glutes,hamstrings,lower_back","quadriceps,traps,forearms","Full body","Hinge","compound"],
  "Superman":["lower_back","glutes","Posterior chain","Isolation","isolation"],
  "Hip Thrust":["glutes","hamstrings","Lower body","Hinge","compound"],
  "Glute Bridge":["glutes","hamstrings","Lower body","Hinge","isolation"],
  "Cable Kickback":["glutes","hamstrings","Lower body","Isolation","isolation"],
  "Donkey Kick":["glutes","","Lower body","Isolation","isolation"],
  "Bulgarian Split Squat":["glutes,quadriceps","hamstrings","Lower body","Squat","compound"],
  "Step-up":["glutes,quadriceps","hamstrings","Lower body","Squat","compound"],
  "Glute Machine":["glutes","","Lower body","Isolation","isolation"],
  "Lateral Leg Raise":["abductors,glutes","","Lower body","Isolation","isolation"],
  "Squat":["quadriceps,glutes","hamstrings,lower_back,abs","Lower body","Squat","compound"],
  "Front Squat":["quadriceps","glutes,abs","Lower body","Squat","compound"],
  "Hack Squat":["quadriceps","glutes","Lower body","Squat","compound"],
  "Leg Press":["quadriceps,glutes","hamstrings","Lower body","Squat","compound"],
  "Leg Extension":["quadriceps","","Lower body","Isolation","isolation"],
  "Goblet Squat":["quadriceps,glutes","abs","Lower body","Squat","compound"],
  "Walking Lunge":["quadriceps,glutes","hamstrings","Lower body","Squat","compound"],
  "Reverse Lunge":["quadriceps,glutes","hamstrings","Lower body","Squat","compound"],
  "Stiff Leg Deadlift":["hamstrings","glutes,lower_back","Posterior chain","Hinge","compound"],
  "Lying Leg Curl":["hamstrings","","Lower body","Isolation","isolation"],
  "Seated Leg Curl":["hamstrings","","Lower body","Isolation","isolation"],
  "Nordic Curl":["hamstrings","glutes","Lower body","Isolation","isolation"],
  "Single-leg RDL":["hamstrings,glutes","lower_back","Posterior chain","Hinge","compound"],
  "Standing Calf Raise":["calves","","Lower body","Isolation","isolation"],
  "Seated Calf Raise":["calves","","Lower body","Isolation","isolation"],
  "Donkey Calf Raise":["calves","","Lower body","Isolation","isolation"],
  "Single-leg Calf Raise":["calves","","Lower body","Isolation","isolation"],
  "Crunch":["abs","","Core","Core","isolation"],
  "Cable Crunch":["abs","","Core","Core","isolation"],
  "Hanging Leg Raise":["abs,hip_flexors","obliques","Core","Core","isolation"],
  "Reverse Crunch":["abs","hip_flexors","Core","Core","isolation"],
  "Russian Twist":["obliques,abs","","Core","Core","isolation"],
  "Plank":["abs","obliques,shoulders_front","Core","Core","isolation"],
  "Bicycle Crunch":["abs,obliques","","Core","Core","isolation"],
  "Heel Taps":["obliques","abs","Core","Core","isolation"],
  "Mountain Climbers":["abs","hip_flexors,shoulders_front","Core","Core","compound"],
  "Ab Wheel Rollout":["abs","lats,shoulders_front","Core","Core","compound"],
  "Wrist Curl":["forearms","","Upper body","Isolation","isolation"],
  "Reverse Wrist Curl":["forearms","","Upper body","Isolation","isolation"],
  "Farmer's Walk":["forearms,traps","glutes,abs","Full body","Carry","compound"],
  "Plate Pinch":["forearms","","Upper body","Isolation","isolation"],
  "Behind-the-back Wrist Curl":["forearms","","Upper body","Isolation","isolation"],
  "Barbell Shrug":["traps","","Upper body","Isolation","isolation"],
  "Dumbbell Shrug":["traps","","Upper body","Isolation","isolation"],
  "Neck Flexion":["","","Neck","Isolation","isolation"],
  "Neck Extension":["","","Neck","Isolation","isolation"],
  "Neck Lateral Flexion":["","","Neck","Isolation","isolation"],
  "Clean":["quadriceps,glutes,traps","hamstrings,lower_back,shoulders_side","Full body","Olympic","compound"],
  "Clean & Jerk":["quadriceps,glutes,shoulders_side","triceps,traps,lower_back","Full body","Olympic","compound"],
  "Snatch":["shoulders_side,quadriceps,glutes","traps,lower_back,triceps","Full body","Olympic","compound"],
  "Hang Clean":["traps,quadriceps,glutes","hamstrings,shoulders_side","Full body","Olympic","compound"],
  "Hang Snatch":["shoulders_side,traps","quadriceps,glutes","Full body","Olympic","compound"],
  "Push Press":["shoulders_front,shoulders_side","triceps,quadriceps,glutes","Full body","Push","compound"],
  "Thruster":["quadriceps,shoulders_front","glutes,triceps","Full body","Squat","compound"],
  "Overhead Squat":["quadriceps,shoulders_side","glutes,abs","Full body","Squat","compound"]
};
function exInfo(name){
  var d=EXDATA[name];
  if(d) return { p:d[0]?d[0].split(","):[], s:d[1]?d[1].split(","):[], region:d[2], mv:d[3], t:d[4] };
  var c=state.customData&&state.customData[name];
  if(c) return { p:c.p||[], s:c.s||[], region:c.region||"Custom", mv:c.mv||"—", t:c.t||"—" };
  return null;
}
var MUSCLE_GROUPS=[
  {id:"chest",label:"Chest"},{id:"shoulders_side",label:"Shoulders"},{id:"biceps",label:"Biceps"},
  {id:"triceps",label:"Triceps"},{id:"lats",label:"Lats"},{id:"upper_back",label:"Upper back"},
  {id:"lower_back",label:"Lower back"},{id:"traps",label:"Traps"},{id:"forearms",label:"Forearms"},
  {id:"abs",label:"Abs / core"},{id:"obliques",label:"Obliques"},{id:"glutes",label:"Glutes"},
  {id:"quadriceps",label:"Quads"},{id:"hamstrings",label:"Hamstrings"},{id:"calves",label:"Calves"}
];
var MUSCLE_LABEL={chest:"Chest",shoulders_front:"Front delts",shoulders_side:"Side delts",shoulders_rear:"Rear delts",biceps:"Biceps",triceps:"Triceps",forearms:"Forearms",traps:"Traps",lats:"Lats",upper_back:"Upper back",lower_back:"Lower back",abs:"Abs",obliques:"Obliques",glutes:"Glutes",quadriceps:"Quads",hamstrings:"Hamstrings",calves:"Calves",hip_flexors:"Hip flexors",adductors:"Adductors",abductors:"Abductors"};
function muscleLabel(id){ return MUSCLE_LABEL[id]||id; }

/* schematic body maps (front & back). muscle shapes carry their muscle-id as a class */
var SVG_FRONT='<svg viewBox="0 0 100 178" xmlns="http://www.w3.org/2000/svg">'
  +'<g class="sil">'
  +'<circle cx="50" cy="13" r="8.5"/><rect x="34" y="24" width="32" height="46" rx="8"/>'
  +'<rect x="19" y="28" width="9" height="26" rx="4.5"/><rect x="72" y="28" width="9" height="26" rx="4.5"/>'
  +'<rect x="16" y="52" width="8" height="24" rx="4"/><rect x="76" y="52" width="8" height="24" rx="4"/>'
  +'<rect x="36" y="66" width="28" height="14" rx="5"/>'
  +'<rect x="35" y="78" width="12" height="44" rx="6"/><rect x="53" y="78" width="12" height="44" rx="6"/>'
  +'<rect x="37" y="122" width="9" height="42" rx="4.5"/><rect x="54" y="122" width="9" height="42" rx="4.5"/></g>'
  +'<ellipse class="m chest" cx="42" cy="40" rx="7" ry="6"/><ellipse class="m chest" cx="58" cy="40" rx="7" ry="6"/>'
  +'<circle class="m shoulders_front shoulders_side" cx="24" cy="33" r="6"/><circle class="m shoulders_front shoulders_side" cx="76" cy="33" r="6"/>'
  +'<ellipse class="m traps" cx="44" cy="27" rx="4" ry="3"/><ellipse class="m traps" cx="56" cy="27" rx="4" ry="3"/>'
  +'<ellipse class="m biceps" cx="22" cy="46" rx="4" ry="8"/><ellipse class="m biceps" cx="78" cy="46" rx="4" ry="8"/>'
  +'<ellipse class="m forearms" cx="19" cy="66" rx="3.6" ry="10"/><ellipse class="m forearms" cx="81" cy="66" rx="3.6" ry="10"/>'
  +'<rect class="m abs" x="44" y="49" width="12" height="20" rx="3"/>'
  +'<ellipse class="m obliques" cx="40" cy="57" rx="2.6" ry="8"/><ellipse class="m obliques" cx="60" cy="57" rx="2.6" ry="8"/>'
  +'<ellipse class="m quadriceps hip_flexors adductors" cx="41" cy="100" rx="6" ry="19"/><ellipse class="m quadriceps hip_flexors adductors" cx="59" cy="100" rx="6" ry="19"/>'
  +'</svg>';
var SVG_BACK='<svg viewBox="0 0 100 178" xmlns="http://www.w3.org/2000/svg">'
  +'<g class="sil">'
  +'<circle cx="50" cy="13" r="8.5"/><rect x="34" y="24" width="32" height="46" rx="8"/>'
  +'<rect x="19" y="28" width="9" height="26" rx="4.5"/><rect x="72" y="28" width="9" height="26" rx="4.5"/>'
  +'<rect x="16" y="52" width="8" height="24" rx="4"/><rect x="76" y="52" width="8" height="24" rx="4"/>'
  +'<rect x="36" y="66" width="28" height="14" rx="5"/>'
  +'<rect x="35" y="78" width="12" height="44" rx="6"/><rect x="53" y="78" width="12" height="44" rx="6"/>'
  +'<rect x="37" y="122" width="9" height="42" rx="4.5"/><rect x="54" y="122" width="9" height="42" rx="4.5"/></g>'
  +'<path class="m traps" d="M39 25 h22 l-4 13 h-14 z"/>'
  +'<circle class="m shoulders_rear shoulders_side" cx="24" cy="33" r="6"/><circle class="m shoulders_rear shoulders_side" cx="76" cy="33" r="6"/>'
  +'<ellipse class="m upper_back" cx="43" cy="43" rx="4" ry="5"/><ellipse class="m upper_back" cx="57" cy="43" rx="4" ry="5"/>'
  +'<ellipse class="m lats" cx="40" cy="56" rx="5" ry="11"/><ellipse class="m lats" cx="60" cy="56" rx="5" ry="11"/>'
  +'<ellipse class="m triceps" cx="22" cy="46" rx="4" ry="8"/><ellipse class="m triceps" cx="78" cy="46" rx="4" ry="8"/>'
  +'<ellipse class="m forearms" cx="19" cy="66" rx="3.6" ry="10"/><ellipse class="m forearms" cx="81" cy="66" rx="3.6" ry="10"/>'
  +'<rect class="m lower_back" x="44" y="63" width="12" height="12" rx="3"/>'
  +'<ellipse class="m glutes abductors" cx="43" cy="86" rx="7" ry="7"/><ellipse class="m glutes abductors" cx="57" cy="86" rx="7" ry="7"/>'
  +'<ellipse class="m hamstrings" cx="41" cy="106" rx="6" ry="16"/><ellipse class="m hamstrings" cx="59" cy="106" rx="6" ry="16"/>'
  +'<ellipse class="m calves" cx="41" cy="148" rx="5" ry="13"/><ellipse class="m calves" cx="59" cy="148" rx="5" ry="13"/>'
  +'</svg>';
function muscleMapLoad(load){
  var wrap=el('<div class="bodymap"></div>');
  wrap.appendChild(el('<div class="bodyview"><div class="bvlabel">Front</div>'+SVG_FRONT+'</div>'));
  wrap.appendChild(el('<div class="bodyview"><div class="bvlabel">Back</div>'+SVG_BACK+'</div>'));
  Array.prototype.forEach.call(wrap.querySelectorAll('.m'),function(shape){
    var cls=(shape.getAttribute('class')||'').split(/\s+/);
    var inten=0;
    cls.forEach(function(c){ if(c!=='m' && load[c]!=null && load[c]>inten) inten=load[c]; });
    if(inten>0){ var a=(0.30+0.70*Math.min(1,inten)); shape.style.fill='rgba(47,128,255,'+a.toFixed(2)+')'; }
  });
  return wrap;
}
function muscleMapRoles(pIds,sIds){
  var wrap=el('<div class="bodymap"></div>');
  wrap.appendChild(el('<div class="bodyview"><div class="bvlabel">Front</div>'+SVG_FRONT+'</div>'));
  wrap.appendChild(el('<div class="bodyview"><div class="bvlabel">Back</div>'+SVG_BACK+'</div>'));
  var pset={}, sset={};
  (pIds||[]).forEach(function(id){ pset[id]=1; });
  (sIds||[]).forEach(function(id){ sset[id]=1; });
  Array.prototype.forEach.call(wrap.querySelectorAll('.m'),function(shape){
    var cls=(shape.getAttribute('class')||'').split(/\s+/);
    var isP=false,isS=false;
    cls.forEach(function(c){ if(pset[c])isP=true; else if(sset[c])isS=true; });
    if(isP) shape.style.fill='var(--blue)';
    else if(isS) shape.style.fill='var(--sec)';
  });
  return wrap;
}
function muscleLegend(){
  return el('<div class="mlegend"><span class="mlg"><span class="sw" style="background:var(--blue)"></span>Primary</span><span class="mlg"><span class="sw" style="background:var(--sec)"></span>Secondary</span></div>');
}
/* effective-sets model: each logged set adds 1.0 to every primary muscle and 0.5 to every secondary muscle */
function aggregateLoad(exercises){
  var eff={};
  (exercises||[]).forEach(function(ex){
    if(ex.cardio) return;
    var info=exInfo(ex.name); if(!info) return;
    var setCount=ex.sets.filter(function(x){return x.reps||x.weight;}).length;
    if(setCount===0) setCount=ex.sets.length||1;
    info.p.forEach(function(id){ eff[id]=(eff[id]||0)+1.0*setCount; });
    info.s.forEach(function(id){ eff[id]=(eff[id]||0)+0.5*setCount; });
  });
  return eff;
}
function musclePanel(exercises){
  var eff=aggregateLoad(exercises);
  var ids=Object.keys(eff);
  var wrap=el('<div></div>');
  if(ids.length===0){ wrap.appendChild(el('<div style="color:var(--muted-2);font-size:13px;padding:8px 2px">No muscle data for these exercises yet.</div>')); return wrap; }
  var maxv=0; ids.forEach(function(id){ if(eff[id]>maxv)maxv=eff[id]; });
  var load={}; ids.forEach(function(id){ load[id]=eff[id]/maxv; });
  wrap.appendChild(muscleMapLoad(load));
  ids.sort(function(a,b){ return eff[b]-eff[a]; });
  wrap.appendChild(el('<div class="mus-list-head"><span>Muscle</span><span>Effective sets</span></div>'));
  var bars=el('<div class="mus-list"></div>');
  ids.forEach(function(id){
    var pct=Math.round((eff[id]/maxv)*100);
    bars.appendChild(el('<div class="mus-row"><span class="mus-name">'+esc(muscleLabel(id))+'</span><div class="mus-bar"><div class="mus-fill" style="width:'+pct+'%"></div></div><span class="mus-val">'+(Math.round(eff[id]*10)/10)+'</span></div>'));
  });
  wrap.appendChild(bars);
  return wrap;
}
function exStats(name){
  var r={heaviest:0,best1rm:0,bestSetVol:0,bestSessVol:0,sessions:0,longest:0,totalMin:0,cardio:false};
  state.sessions.forEach(function(s){
    if(s.type!=="strength"||!s.exercises) return;
    var sessVol=0, found=false;
    s.exercises.forEach(function(ex){
      if(ex.name!==name) return;
      found=true;
      if(ex.cardio){ r.cardio=true; ex.sets.forEach(function(st){ var m=Number(st.min)||0; if(m>r.longest)r.longest=m; r.totalMin+=m; }); }
      else{
        ex.sets.forEach(function(st){
          var w=Number(st.weight)||0, rp=Number(st.reps)||0;
          if(w>r.heaviest)r.heaviest=w;
          if(w>0&&rp>0){ var orm=w*(1+rp/30); if(orm>r.best1rm)r.best1rm=orm; var sv=w*rp; if(sv>r.bestSetVol)r.bestSetVol=sv; sessVol+=sv; }
        });
      }
    });
    if(found){ r.sessions++; if(sessVol>r.bestSessVol)r.bestSessVol=sessVol; }
  });
  return r;
}
function exHistory(name){
  var out=[];
  state.sessions.forEach(function(s){
    if(s.type!=="strength"||!s.exercises) return;
    s.exercises.forEach(function(ex){ if(ex.name===name) out.push({s:s,ex:ex}); });
  });
  return out.reverse();
}
var exDetailTab="summary";
function openExerciseDetail(name,backFn){
  stopTimer(); exDetailTab="summary"; renderExerciseDetail(name,backFn);
}
function renderExerciseDetail(name,backFn){
  var inner=document.getElementById("logInner"); inner.innerHTML="";
  var head=el('<div class="screen-head"><button class="link iconbtn" aria-label="Back"><svg class="hd-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><h2 style="font-size:17px">'+esc(name)+'</h2><span style="width:44px"></span></div>');
  head.children[0].onclick=backFn;
  inner.appendChild(head);

  var tabs=el('<div class="detabs"></div>');
  [["summary","Summary"],["history","History"],["muscles","Muscles"]].forEach(function(t){
    var b=el('<button class="detab'+(exDetailTab===t[0]?" on":"")+'">'+t[1]+'</button>');
    b.onclick=function(){ exDetailTab=t[0]; renderExerciseDetail(name,backFn); };
    tabs.appendChild(b);
  });
  inner.appendChild(tabs);

  var body=el('<div></div>'); inner.appendChild(body);

  if(exDetailTab==="summary"){
    var st=exStats(name);
    if(st.cardio){
      body.appendChild(prRow("Sessions logged", st.sessions));
      body.appendChild(prRow("Longest session", st.longest?st.longest+" min":"—"));
      body.appendChild(prRow("Total time", st.totalMin?st.totalMin+" min":"—"));
    }else if(st.sessions===0){
      body.appendChild(el('<div class="empty" style="padding-top:24px"><span class="big">No records yet.</span>Log this exercise a few times and your personal records show up here.</div>'));
    }else{
      body.appendChild(el('<div class="sec-title" style="margin-top:2px">Personal records</div>'));
      body.appendChild(prRow("Heaviest weight", st.heaviest?st.heaviest+" kg":"—"));
      body.appendChild(prRow("Best 1RM (est.)", st.best1rm?(Math.round(st.best1rm*10)/10)+" kg":"—"));
      body.appendChild(prRow("Best set volume", st.bestSetVol?(Math.round(st.bestSetVol*10)/10)+" kg":"—"));
      body.appendChild(prRow("Best session volume", st.bestSessVol?(Math.round(st.bestSessVol*10)/10)+" kg":"—"));
      body.appendChild(prRow("Times logged", st.sessions));
    }
  }else if(exDetailTab==="history"){
    var hist=exHistory(name);
    if(hist.length===0){
      body.appendChild(el('<div class="empty" style="padding-top:24px"><span class="big">No history yet.</span>Once you log this exercise, every day shows up here.</div>'));
    }else{
      hist.forEach(function(h){
        var entry=el('<div class="hist-entry"></div>');
        var title=h.s.routineName||"Workout";
        entry.appendChild(el('<div class="hist-top"><div class="ht">'+esc(title)+'</div><div class="hd">'+fmtFullDate(h.s.ts)+'</div></div>'));
        entry.appendChild(setTable(h.ex));
        body.appendChild(entry);
      });
    }
  }else{
    var info=exInfo(name);
    if(info){ body.appendChild(el('<div style="color:var(--muted-2);font-size:13px;margin:2px 2px 12px;text-align:center">'+esc(info.region)+' &middot; '+esc(info.mv)+' &middot; '+(info.t==="compound"?"Compound":(info.t==="isolation"?"Isolation":"—"))+'</div>')); }
    body.appendChild(muscleMapRoles(info?info.p:[], info?info.s:[]));
    if(info && (info.p.length||info.s.length)) body.appendChild(muscleLegend());
    if(info && info.p.length){
      body.appendChild(el('<div class="sec-title" style="margin-top:14px">Primary</div>'));
      var pc=el('<div class="chips"></div>');
      info.p.forEach(function(id){ pc.appendChild(el('<span class="chip" style="cursor:default;background:var(--blue);border-color:var(--blue);color:#fff">'+esc(muscleLabel(id))+'</span>')); });
      body.appendChild(pc);
    }
    if(info && info.s.length){
      body.appendChild(el('<div class="sec-title" style="margin-top:16px">Secondary</div>'));
      var sc=el('<div class="chips"></div>');
      info.s.forEach(function(id){ sc.appendChild(el('<span class="chip" style="cursor:default;background:rgba(255,159,107,.18);border-color:var(--sec);color:var(--sec)">'+esc(muscleLabel(id))+'</span>')); });
      body.appendChild(sc);
    }
    if(!info){ body.appendChild(el('<div style="color:var(--muted-2);font-size:13px;margin-top:14px">No muscle data for this exercise.</div>')); }
  }
}
function prRow(label,val){ return el('<div class="pr"><span class="prl">'+esc(String(label))+'</span><span class="prv">'+esc(String(val))+'</span></div>'); }
function setTable(ex){
  var wrap=el('<div class="histset"></div>');
  wrap.appendChild(el('<div class="histset-head"><span>Set</span><span>'+(ex.cardio?"Minutes":"Weight &amp; reps")+'</span></div>'));
  var rows=el('<div class="histset-rows"></div>');
  var n=0;
  ex.sets.forEach(function(st){
    if(!(st.reps||st.weight||st.min)) return;
    n++;
    var bodyHtml = ex.cardio
      ? ('<span class="hs-body"><span class="hs-w">'+(st.min||0)+'</span> min</span>')
      : ('<span class="hs-body"><span class="hs-w">'+(st.weight||0)+' kg</span> <span class="hs-x">&times;</span> '+(st.reps||0)+'</span>');
    rows.appendChild(el('<div class="histset-row"><span class="hs-set">'+n+'</span>'+bodyHtml+'</div>'));
  });
  wrap.appendChild(rows);
  return wrap;
}
function fmtFullDate(ts){
  var d=new Date(ts);
  var days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],mon=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return days[d.getDay()]+" "+d.getDate()+" "+mon[d.getMonth()]+" "+d.getFullYear()+", "+d.getHours()+":"+pad(d.getMinutes());
}
function openSessionDetail(s){
  var inner=document.getElementById("logInner"); inner.innerHTML="";
  var head=el('<div class="screen-head"><button class="link iconbtn" aria-label="Close"><svg class="hd-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><h2>Workout</h2><span style="width:44px"></span></div>');
  head.children[0].onclick=function(){ closeScreen(); };
  inner.appendChild(head);
  var title=s.type==="strength"?(s.routineName||"Workout"):(s.cardioType||"Cardio");
  inner.appendChild(el('<h2 style="font-size:24px;margin:2px 2px 4px">'+esc(title)+'</h2>'));
  inner.appendChild(el('<div style="color:var(--muted-2);font-size:13px;margin-bottom:16px">'+fmtFullDate(s.ts)+(s.durationSec?' &middot; '+fmtDur(s.durationSec,false):'')+'</div>'));
  if(s.type==="strength"){
    (s.exercises||[]).forEach(function(ex){
      var block=el('<div class="ex"></div>');
      var tap=el('<div class="ex-head"><div class="ex-tap" style="display:flex;align-items:center;gap:12px;flex:1;cursor:pointer;min-width:0">'+thumb(ex.name)+'<div class="n">'+esc(ex.name)+'</div></div></div>');
      tap.querySelector(".ex-tap").onclick=function(){ openExerciseDetail(ex.name, function(){ openSessionDetail(s); }); };
      block.appendChild(tap);
      block.appendChild(setTable(ex));
      inner.appendChild(block);
    });
  }else{
    inner.appendChild(el('<div class="ex"><div class="ex-head">'+thumb(s.cardioType)+'<div class="n">'+esc(s.cardioType)+'</div></div><div class="dset-line"><span>'+s.duration+' min &middot; '+esc((s.intensity||"").replace(" (conversational)",""))+'</span></div></div>'));
  }
  if(s.notes){
    inner.appendChild(el('<div class="sec-title">Note</div>'));
    inner.appendChild(el('<div style="color:var(--muted);font-size:14px;line-height:1.45">'+esc(s.notes)+'</div>'));
  }
  if(s.type==="strength" && Object.keys(aggregateLoad(s.exercises)).length){
    inner.appendChild(el('<div class="sec-title">Muscles worked</div>'));
    inner.appendChild(musclePanel(s.exercises));
  }
  openScreen();
}

/* drafts + timer */
var draft=null, routineDraft=null, pickerMode="workout", wkTimer=null;

/* ---- storage ---- */
function save(){ try{ if(window.storage&&window.storage.set){ window.storage.set(STORE_KEY,JSON.stringify(state),false).catch(function(){}); } }catch(e){} }
function load(cb){
  try{
    if(window.storage&&window.storage.get){
      window.storage.get(STORE_KEY,false).then(function(r){
        if(r&&r.value){ try{ state=JSON.parse(r.value); }catch(e){} }
        ensure(); cb();
      }).catch(function(){ ensure(); cb(); });
      return;
    }
  }catch(e){}
  ensure(); cb();
}
function ensure(){ state.sessions=state.sessions||[]; state.customExercises=state.customExercises||[]; state.routines=state.routines||[]; state.folders=state.folders||[]; state.customData=state.customData||{}; state.targets=state.targets||{}; }

/* ---- helpers ---- */
function el(html){ var d=document.createElement("div"); d.innerHTML=html.trim(); return d.firstChild; }
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function uiConfirm(message, onYes, danger){
  var back=el('<div class="dlg-back"></div>');
  var card=el('<div class="dlg"><div class="dlg-msg">'+esc(message)+'</div><div class="dlg-btns"></div></div>');
  var btns=card.querySelector(".dlg-btns");
  var cancel=el('<button class="dlg-b cancel">Cancel</button>');
  var ok=el('<button class="dlg-b '+(danger?'danger':'ok')+'">'+(danger?'Delete':'OK')+'</button>');
  var close=function(){ if(back.parentNode) back.parentNode.removeChild(back); };
  cancel.onclick=close;
  ok.onclick=function(){ close(); onYes(); };
  btns.appendChild(cancel); btns.appendChild(ok);
  back.appendChild(card);
  back.onclick=function(e){ if(e.target===back) close(); };
  document.body.appendChild(back);
}
function uiAlert(message){
  var back=el('<div class="dlg-back"></div>');
  var card=el('<div class="dlg"><div class="dlg-msg">'+esc(message)+'</div><div class="dlg-btns"></div></div>');
  var ok=el('<button class="dlg-b ok">OK</button>');
  ok.onclick=function(){ if(back.parentNode) back.parentNode.removeChild(back); };
  card.querySelector(".dlg-btns").appendChild(ok);
  back.appendChild(card);
  back.onclick=function(e){ if(e.target===back && back.parentNode) back.parentNode.removeChild(back); };
  document.body.appendChild(back);
}
function pad(n){ return n<10?"0"+n:""+n; }
function todayKey(d){ d=d||new Date(); return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); }
function fmtDate(ts){
  var d=new Date(ts),n=new Date(),y=new Date(n.getTime()-864e5);
  if(todayKey(d)===todayKey(n)) return "Today";
  if(todayKey(d)===todayKey(y)) return "Yesterday";
  var days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],mon=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return days[d.getDay()]+" "+d.getDate()+" "+mon[d.getMonth()];
}
function fmtDur(sec,live){
  sec=Math.max(0,Math.round(sec));
  var h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
  return h>0?(h+":"+pad(m)+":"+pad(s)):(m+":"+pad(s));
}
function clampNonNeg(inp){ if(inp.value!==""&&Number(inp.value)<0) inp.value=0; }
function lastSetsFor(name){
  for(var i=state.sessions.length-1;i>=0;i--){
    var s=state.sessions[i]; if(s.type!=="strength") continue;
    for(var j=0;j<s.exercises.length;j++){
      if(s.exercises[j].name===name){
        var done=s.exercises[j].sets.filter(function(x){return x.reps||x.weight;});
        if(done.length) return done;
      }
    }
  }
  return null;
}
function startOfWeek(){ var d=new Date(),day=(d.getDay()+6)%7; d.setHours(0,0,0,0); d.setDate(d.getDate()-day); return d; }
function weekSessions(){ var mon=startOfWeek().getTime(),end=mon+7*864e5; return state.sessions.filter(function(s){return s.ts>=mon&&s.ts<end;}); }

var ICON_STRENGTH='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5l11 11"/><rect x="1.7" y="8.2" width="3.5" height="7.6" rx="1" transform="rotate(-45 3.4 12)"/><rect x="18.8" y="8.2" width="3.5" height="7.6" rx="1" transform="rotate(-45 20.6 12)"/></svg>';
var ICON_CARDIO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>';

/* ---------- WORKOUT TAB ---------- */
function renderWorkout(){
  var app=document.getElementById("app"); app.innerHTML="";

  var hour=new Date().getHours();
  var hi=hour<6?"Still up?":hour<12?"Good morning":hour<18?"Good afternoon":"Good evening";
  var week=weekSessions();
  var dayLbls=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],mon=startOfWeek(),strip="";
  for(var i=0;i<7;i++){
    var d=new Date(mon.getTime()+i*864e5);
    var done=week.some(function(s){return todayKey(new Date(s.ts))===todayKey(d);});
    var isT=todayKey(d)===todayKey(new Date());
    strip+='<div class="day '+(done?"done ":"")+(isT?"today":"")+'"><div class="dot">'+(done?"&#10003;":"")+'</div><div class="lbl">'+dayLbls[i]+'</div></div>';
  }
  var cnt=week.length;
  var sub=cnt===0?"No sessions yet this week &mdash; and that's okay.":cnt===1?"1 session this week. Nice start.":cnt+" sessions this week. Good rhythm.";
  var card=el('<div class="card greeting"></div>');
  card.appendChild(el('<h2>'+hi+'.</h2>'));
  card.appendChild(el('<p>'+sub+'</p>'));
  card.appendChild(el('<div class="week">'+strip+'</div>'));
  var cols=el('<div class="cols"></div>');
  var left=el('<div class="col"></div>');
  var right=el('<div class="col"></div>');
  cols.appendChild(left); cols.appendChild(right);
  app.appendChild(cols);

  left.appendChild(card);

  var acts=el('<div class="actions" style="margin-top:2px"></div>');
  var b1=el('<button class="action strength" style="grid-column:1/-1;display:flex;align-items:center;justify-content:center;gap:12px"><span class="ico" style="margin:0">'+ICON_STRENGTH+'</span><span class="t" style="font-size:16px">Quick start</span></button>');
  b1.onclick=function(){ startStrength(null); };
  acts.appendChild(b1);
  left.appendChild(acts);

  var rhead=el('<div class="routines-head"><span class="t">Routines</span><button class="nf">+ New folder</button></div>');
  rhead.querySelector(".nf").onclick=function(){ openFolderEditor(null); };
  right.appendChild(rhead);

  var add=el('<button class="add-routine">+ New routine</button>');
  add.onclick=function(){ openRoutineEditor(null); };
  right.appendChild(add);

  // folders (collapsible)
  state.folders.forEach(function(f){ right.appendChild(folderBlock(f)); });

  // ungrouped routines
  var folderIds={}; state.folders.forEach(function(f){ folderIds[f.id]=true; });
  var ungrouped=state.routines.filter(function(r){ return !r.folderId || !folderIds[r.folderId]; });

  if(state.routines.length===0 && state.folders.length===0){
    right.appendChild(el('<div class="empty" style="padding-top:6px"><span class="big">No routines yet.</span>Build a fixed workout &mdash; give it a name and start it each week with one tap. Group them into folders if you like.</div>'));
  }else if(ungrouped.length){
    if(state.folders.length) right.appendChild(el('<div class="folder-label">My routines</div>'));
    var rlist=el('<div class="routine-list"></div>');
    ungrouped.forEach(function(r){ rlist.appendChild(routineCard(r)); });
    right.appendChild(rlist);
  }
}
function folderBlock(f){
  var inFolder=state.routines.filter(function(r){return r.folderId===f.id;});
  var block=el('<div class="folder'+(f.collapsed?"":" open")+'"></div>');
  var icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
  var head=el('<div class="folder-head"><span class="ficon">'+icon+'</span><span class="fname">'+esc(f.name)+'</span><span class="fcount">'+inFolder.length+'</span><button class="fmenu" aria-label="Folder options">&#8942;</button></div>');
  head.onclick=function(){ toggleFolder(f.id); };
  head.querySelector(".fmenu").onclick=function(e){ e.stopPropagation(); openFolderEditor(f); };
  block.appendChild(head);
  if(!f.collapsed){
    var body=el('<div class="folder-body"></div>');
    if(inFolder.length===0){
      body.appendChild(el('<div class="folder-empty">Empty folder. Create a routine and set its folder to &ldquo;'+esc(f.name)+'&rdquo;.</div>'));
    }else{
      var rlist=el('<div class="routine-list"></div>');
      inFolder.forEach(function(r){ rlist.appendChild(routineCard(r)); });
      body.appendChild(rlist);
    }
    block.appendChild(body);
  }
  return block;
}
function routineCard(r){
  var names=r.exercises.map(function(e){return e.name;});
  var summary=names.slice(0,4).join(", ")+(names.length>4?"…":"");
  var c=el('<div class="routine" style="cursor:pointer"></div>');
  c.appendChild(el('<div class="rtop"><div style="min-width:0"><div class="rn">'+esc(r.name)+'</div><div class="rx">'+esc(summary||"No exercises")+'</div></div><div class="chev">&rsaquo;</div></div>'));
  c.onclick=function(){ openRoutineDetail(r.id); };
  return c;
}

/* ---------- ROUTINE EDITOR ---------- */
function folderNameById(id){ var f=state.folders.filter(function(x){return x.id===id;})[0]; return f?f.name:""; }
function openRoutineEditor(existing){
  routineDraft = existing ? clone(existing) : { id:"r"+Date.now(), name:"", exercises:[] };
  routineDraft.folderName = existing && existing.folderId ? folderNameById(existing.folderId) : "";
  renderRoutineEditor();
  openScreen();
}
function renderRoutineEditor(){
  var inner=document.getElementById("logInner"); inner.innerHTML="";
  var isEdit=state.routines.some(function(r){return r.id===routineDraft.id;});
  var head=el('<div class="screen-head"><button class="link iconbtn" aria-label="Close"><svg class="hd-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><h2>'+(isEdit?"Routine":"New routine")+'</h2><span style="width:44px"></span></div>');
  head.children[0].onclick=function(){ closeScreen(); };
  inner.appendChild(head);

  var nf=el('<div class="field"><label>Routine name</label></div>');
  var ni=el('<input placeholder="Leg day" value="'+esc(routineDraft.name)+'">');
  ni.oninput=function(){ routineDraft.name=ni.value; };
  nf.appendChild(ni);
  inner.appendChild(nf);

  var ff=el('<div class="field"><label>Folder (optional)</label></div>');
  var listId="folderlist";
  var fi=el('<input list="'+listId+'" placeholder="e.g. Boek — type a new or existing folder" value="'+esc(routineDraft.folderName||"")+'">');
  fi.oninput=function(){ routineDraft.folderName=fi.value; };
  var dl=el('<datalist id="'+listId+'"></datalist>');
  state.folders.forEach(function(f){ dl.appendChild(el('<option value="'+esc(f.name)+'">')); });
  ff.appendChild(fi); ff.appendChild(dl);
  inner.appendChild(ff);

  if(routineDraft.exercises.length===0){
    inner.appendChild(el('<div class="empty"><span class="big">No exercises yet.</span>Add exercises and set the target sets and reps for each.</div>'));
  }
  routineDraft.exercises.forEach(function(ex,ei){ inner.appendChild(setBlock(ex,ei,"routine")); });

  var add=el('<button class="btn ghost">+ Add exercise</button>');
  add.onclick=function(){ pickerMode="routine"; openPicker(); };
  inner.appendChild(add);

  var savebtn=el('<button class="btn primary" style="margin-top:16px">Save routine</button>');
  savebtn.onclick=function(){ saveRoutine(); };
  inner.appendChild(savebtn);
}
function resolveFolder(name){
  name=(name||"").trim();
  if(!name) return null;
  var existing=state.folders.filter(function(f){return f.name.toLowerCase()===name.toLowerCase();})[0];
  if(existing) return existing.id;
  var nf={ id:"f"+Date.now(), name:name, collapsed:false };
  state.folders.push(nf);
  return nf.id;
}
function saveRoutine(){
  if(!routineDraft.name.trim()){ uiAlert("Give your routine a name."); return; }
  if(routineDraft.exercises.length===0){ uiAlert("Add at least one exercise."); return; }
  var folderId=resolveFolder(routineDraft.folderName);
  var out=clone(routineDraft);
  delete out.folderName;
  if(folderId) out.folderId=folderId; else delete out.folderId;
  var idx=-1;
  state.routines.forEach(function(r,i){ if(r.id===out.id) idx=i; });
  if(idx>=0) state.routines[idx]=out; else state.routines.push(out);
  save(); closeScreen(); renderWorkout();
}

/* ---------- FOLDERS ---------- */
function openFolderEditor(existing){
  var draftF = existing ? clone(existing) : { id:"f"+Date.now(), name:"", collapsed:false, _new:true };
  var inner=document.getElementById("logInner"); inner.innerHTML="";
  var head=el('<div class="screen-head"><button class="link iconbtn" aria-label="Close"><svg class="hd-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><h2>'+(existing?"Folder":"New folder")+'</h2><span style="width:44px"></span></div>');
  head.children[0].onclick=function(){ closeScreen(); };
  inner.appendChild(head);

  var nf=el('<div class="field"><label>Folder name</label></div>');
  var ni=el('<input placeholder="e.g. Boek" value="'+esc(draftF.name)+'">');
  ni.oninput=function(){ draftF.name=ni.value; };
  nf.appendChild(ni);
  inner.appendChild(nf);

  var savebtn=el('<button class="btn primary" style="margin-top:4px">Save folder</button>');
  savebtn.onclick=function(){
    if(!draftF.name.trim()){ uiAlert("Give your folder a name."); return; }
    var idx=-1; state.folders.forEach(function(f,i){ if(f.id===draftF.id) idx=i; });
    delete draftF._new;
    if(idx>=0) state.folders[idx]=draftF; else state.folders.push(draftF);
    save(); closeScreen(); renderWorkout();
  };
  inner.appendChild(savebtn);

  if(existing){
    var del=el('<button class="link danger" style="display:block;margin:18px auto 0">Delete folder</button>');
    del.onclick=function(){
      uiConfirm('Delete folder "'+existing.name+'"? The routines inside stay — they just move out of the folder.', function(){
        state.routines.forEach(function(r){ if(r.folderId===existing.id) delete r.folderId; });
        state.folders=state.folders.filter(function(f){return f.id!==existing.id;});
        save(); closeScreen(); renderWorkout();
      }, true);
    };
    inner.appendChild(del);
  }
  openScreen();
}
function toggleFolder(id){
  var f=state.folders.filter(function(x){return x.id===id;})[0];
  if(f){ f.collapsed=!f.collapsed; save(); renderWorkout(); }
}

/* ---------- ROUTINE DETAIL ---------- */
var routineMetric="Volume";
function fmtMetric(v,metric){ return metric==="Volume"?(Math.round(v)+" kg"):(metric==="Reps"?(v+" reps"):(v+" min")); }
function plannedMetric(r,metric){
  var vol=0,reps=0;
  r.exercises.forEach(function(ex){ if(ex.cardio) return; ex.sets.forEach(function(st){ var w=Number(st.weight)||0, rp=Number(st.reps)||0; vol+=w*rp; reps+=rp; }); });
  return metric==="Volume"?vol:reps;
}
function routineSessions(name){ return state.sessions.filter(function(s){ return s.type==="strength" && s.routineName===name; }); }
function routineMetricPoints(name, metric){
  return routineSessions(name).map(function(s){
    var vol=0, reps=0;
    (s.exercises||[]).forEach(function(ex){ if(ex.cardio) return; ex.sets.forEach(function(st){ var w=Number(st.weight)||0, r=Number(st.reps)||0; vol+=w*r; reps+=r; }); });
    var val = metric==="Volume"?vol : (metric==="Reps"?reps : Math.round((s.durationSec||0)/60));
    return {ts:s.ts, v:val};
  });
}
function routineChart(pts){
  var W=Math.max(280,pts.length*44), H=118, pad=20;
  var min=Math.min.apply(null,pts.map(function(p){return p.v;}));
  var max=Math.max.apply(null,pts.map(function(p){return p.v;}));
  if(max===min){ max=min+1; min=Math.max(0,min-1); }
  var xs=function(i){return pad+i*((W-2*pad)/(pts.length-1));};
  var ys=function(v){return H-pad-((v-min)/(max-min))*(H-2*pad);};
  var d=pts.map(function(p,i){return (i?"L":"M")+xs(i).toFixed(1)+" "+ys(p.v).toFixed(1);}).join(" ");
  var svg='<div class="line-wrap"><svg width="'+W+'" height="'+H+'" style="display:block"><path d="'+d+'" fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
  pts.forEach(function(p,i){ svg+='<circle cx="'+xs(i).toFixed(1)+'" cy="'+ys(p.v).toFixed(1)+'" r="3.5" fill="var(--blue)"/>'; });
  svg+='</svg></div>';
  return el(svg);
}
function routineSetTable(ex){
  var last = ex.cardio ? null : lastSetsFor(ex.name);
  var wrap=el('<div class="rtable"></div>');
  if(ex.cardio){
    wrap.appendChild(el('<div class="rtable-head cardio"><span>Set</span><span>Minutes</span></div>'));
    var rowsC=el('<div class="rtable-rows"></div>');
    ex.sets.forEach(function(st,i){
      var mn = st.min || (last&&last[i]?last[i].min:"") || "–";
      rowsC.appendChild(el('<div class="rtable-row cardio"><span class="rt-set">'+(i+1)+'</span><span class="rt-v">'+esc(String(mn))+'</span></div>'));
    });
    wrap.appendChild(rowsC);
    return wrap;
  }
  wrap.appendChild(el('<div class="rtable-head"><span>Set</span><span>Kg</span><span>Reps</span></div>'));
  var rows=el('<div class="rtable-rows"></div>');
  ex.sets.forEach(function(st,i){
    var w = st.weight || (last&&last[i]?last[i].weight:"") || "–";
    var rp = st.reps || (last&&last[i]?last[i].reps:"") || "–";
    rows.appendChild(el('<div class="rtable-row"><span class="rt-set">'+(i+1)+'</span><span class="rt-v">'+esc(String(w))+'</span><span class="rt-v">'+esc(String(rp))+'</span></div>'));
  });
  wrap.appendChild(rows);
  return wrap;
}
function openRoutineDetail(id){
  var r=state.routines.filter(function(x){return x.id===id;})[0];
  if(!r) return;
  var inner=document.getElementById("logInner"); inner.innerHTML="";
  var head=el('<div class="screen-head"><button class="link iconbtn" aria-label="Close"><svg class="hd-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><h2 style="font-size:17px">'+esc(r.name)+'</h2><span style="width:44px"></span></div>');
  head.children[0].onclick=function(){ closeScreen(); };
  inner.appendChild(head);

  var start=el('<button class="btn primary" style="margin-bottom:18px">Start routine</button>');
  start.onclick=function(){ startStrength(r); };
  inner.appendChild(start);

  var mt=el('<div class="chips" style="margin-bottom:12px"></div>');
  ["Volume","Reps","Duration"].forEach(function(m){
    var ch=el('<button class="chip'+(routineMetric===m?" on":"")+'">'+m+'</button>');
    ch.onclick=function(){ routineMetric=m; openRoutineDetail(id); };
    mt.appendChild(ch);
  });
  inner.appendChild(mt);
  var pts=routineMetricPoints(r.name, routineMetric);
  var chartCard=el('<div class="card" style="padding:16px"></div>');
  // headline value: latest actual session, else planned (for volume/reps)
  var headline, sub;
  if(pts.length){ headline=fmtMetric(pts[pts.length-1].v, routineMetric); sub="last session"; }
  else if(routineMetric!=="Duration"){ headline=fmtMetric(plannedMetric(r, routineMetric), routineMetric); sub="planned"; }
  else { headline="—"; sub="finish this routine to track duration"; }
  chartCard.appendChild(el('<div style="font-size:28px;font-weight:800;letter-spacing:-.02em">'+headline+'</div><div style="font-size:12px;color:var(--muted-2);margin-top:2px">'+sub+'</div>'));
  if(pts.length>=2){ chartCard.appendChild(routineChart(pts)); }
  else if(pts.length===1){ chartCard.appendChild(el('<div style="color:var(--muted-2);font-size:12.5px;margin-top:10px">Do this routine again to see your trend.</div>')); }
  else { chartCard.appendChild(el('<div style="color:var(--muted-2);font-size:12.5px;margin-top:10px">No history yet &mdash; finish this routine to build your trend.</div>')); }
  inner.appendChild(chartCard);

  var exhead=el('<div class="rex-header"><span class="rex-title">Exercises</span><button class="rex-edit">Edit routine</button></div>');
  exhead.querySelector(".rex-edit").onclick=function(){ openRoutineEditor(r); };
  inner.appendChild(exhead);

  r.exercises.forEach(function(ex){
    var isCustom = state.customExercises.indexOf(ex.name)>=0;
    var block=el('<div class="rex"></div>');
    var htap=el('<div class="rex-head" style="cursor:pointer">'+thumb(ex.name)+'<div class="rex-namewrap"><span class="rex-name">'+esc(ex.name)+'</span>'+(isCustom?'<span class="custom-badge">Custom</span>':'')+'</div></div>');
    htap.onclick=function(){ openExerciseDetail(ex.name, function(){ openRoutineDetail(id); }); };
    block.appendChild(htap);
    block.appendChild(routineSetTable(ex));
    inner.appendChild(block);
  });

  if(Object.keys(aggregateLoad(r.exercises)).length){
    inner.appendChild(el('<div class="sec-title">Muscles trained</div>'));
    inner.appendChild(musclePanel(r.exercises));
  }

  var del=el('<button class="link danger" style="display:block;margin:22px auto 0">Delete routine</button>');
  del.onclick=function(){
    uiConfirm('Delete "'+r.name+'"?', function(){
      state.routines=state.routines.filter(function(x){return x.id!==r.id;});
      save(); closeScreen(); renderWorkout();
    }, true);
  };
  inner.appendChild(del);
  openScreen();
}

/* ---------- screen plumbing ---------- */
function openScreen(){ document.getElementById("logScreen").classList.add("open"); document.body.style.overflow="hidden"; }
function closeScreen(){ document.getElementById("logScreen").classList.remove("open"); document.body.style.overflow=""; draft=null; routineDraft=null; stopTimer(); }
function stopTimer(){ if(wkTimer){ clearInterval(wkTimer); wkTimer=null; } }

/* ---------- shared set editor (strength log + routine editor) ---------- */
function setBlock(ex,ei,mode){
  var isRoutine=(mode==="routine");
  var block=el('<div class="ex"></div>');
  var head=el('<div class="ex-head"><div class="ex-tap" style="display:flex;align-items:center;gap:12px;flex:1;cursor:pointer;min-width:0">'+thumb(ex.name)+'<div class="n">'+esc(ex.name)+'</div></div><button class="rm">&times;</button></div>');
  head.querySelector(".ex-tap").onclick=function(){ openExerciseDetail(ex.name, function(){ isRoutine?renderRoutineEditor():renderStrength(); }); };
  head.querySelector(".rm").onclick=function(){
    (isRoutine?routineDraft:draft).exercises.splice(ei,1);
    isRoutine?renderRoutineEditor():renderStrength();
  };
  block.appendChild(head);

  if(ex.cardio){
    block.appendChild(el('<div class="set-head cardio"><span>Set</span><span>Minutes</span><span></span><span></span></div>'));
    ex.sets.forEach(function(st,si){
      var row=el('<div class="set-row cardio'+(st.done?" done":"")+'"></div>');
      row.appendChild(el('<div class="sn">'+(si+1)+'</div>'));
      var m=el('<input type="number" min="0" inputmode="numeric" placeholder="min" value="'+(st.min||"")+'">');
      m.oninput=function(){ clampNonNeg(m); st.min=m.value; };
      row.appendChild(m);
      var chkc=el('<button class="chk'+(st.done?" on":"")+'">'+CHECK+'</button>');
      chkc.onclick=function(){ st.done=!st.done; row.classList.toggle("done",st.done); chkc.classList.toggle("on",st.done); };
      row.appendChild(chkc);
      var delc=el('<button class="dset">&minus;</button>');
      delc.onclick=function(){ ex.sets.splice(si,1); isRoutine?renderRoutineEditor():renderStrength(); };
      row.appendChild(delc);
      block.appendChild(row);
    });
    var asc=el('<button class="add-set">+ Set</button>');
    asc.onclick=function(){ ex.sets.push({min:"",done:false}); isRoutine?renderRoutineEditor():renderStrength(); };
    block.appendChild(asc);
    if(ex.name==="StairMaster"){
      block.appendChild(el('<div class="note" style="margin-top:12px"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>Around 20&ndash;30 min at a conversational pace keeps stress low. Feeling wound up rather than tired? It&rsquo;s fine to stop earlier.</span></div>'));
    }
    return block;
  }

  if(!isRoutine){
    var prev=lastSetsFor(ex.name);
    if(prev){
      var txt=prev.map(function(x){return (x.weight||0)+"kg&times;"+(x.reps||0);}).join("  ");
      block.appendChild(el('<div class="prev">Last time: '+txt+'</div>'));
    }else{
      block.appendChild(el('<div class="prev">First time with this exercise</div>'));
    }
  }
  block.appendChild(el('<div class="set-head"><span>Set</span><span>Kg</span><span>Reps</span><span></span><span></span></div>'));

  ex.sets.forEach(function(st,si){
    var prevS = !isRoutine ? (lastSetsFor(ex.name)||[])[si] : null;
    var row=el('<div class="set-row'+(st.done?" done":"")+'"></div>');
    row.appendChild(el('<div class="sn">'+(si+1)+'</div>'));
    var w=el('<input type="number" min="0" inputmode="decimal" placeholder="'+(prevS?prevS.weight:"–")+'" value="'+(st.weight||"")+'">');
    var r=el('<input type="number" min="0" inputmode="numeric" placeholder="'+(prevS?prevS.reps:(isRoutine?"10":"–"))+'" value="'+(st.reps||"")+'">');
    w.oninput=function(){ clampNonNeg(w); st.weight=w.value; };
    r.oninput=function(){ clampNonNeg(r); st.reps=r.value; };
    row.appendChild(w); row.appendChild(r);

    var chk=el('<button class="chk'+(st.done?" on":"")+'">'+CHECK+'</button>');
    chk.onclick=function(){ st.done=!st.done; row.classList.toggle("done",st.done); chk.classList.toggle("on",st.done); };
    row.appendChild(chk);

    var del=el('<button class="dset">&minus;</button>');
    del.onclick=function(){ ex.sets.splice(si,1); isRoutine?renderRoutineEditor():renderStrength(); };
    row.appendChild(del);
    block.appendChild(row);
  });

  var as=el('<button class="add-set">+ Set</button>');
  as.onclick=function(){ ex.sets.push({weight:"",reps:"",done:false}); isRoutine?renderRoutineEditor():renderStrength(); };
  block.appendChild(as);
  return block;
}

/* ---------- STRENGTH LOG ---------- */
function startStrength(routine){
  if(routine){
    draft={ type:"strength", ts:Date.now(), startTs:Date.now(), routineName:routine.name, exercises:clone(routine.exercises) };
    draft.exercises.forEach(function(ex){ ex.sets.forEach(function(s){ s.done=false; }); });
  }else{
    draft={ type:"strength", ts:Date.now(), startTs:Date.now(), exercises:[] };
  }
  renderStrength(); openScreen();
}
function renderStrength(){
  var inner=document.getElementById("logInner"); inner.innerHTML="";
  var ttl=draft.routineName?esc(draft.routineName):"Workout";
  var head=el('<div class="screen-head"><button class="link iconbtn" aria-label="Close"><svg class="hd-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><h2>'+ttl+'</h2><button class="link done">Finish</button></div>');
  head.children[0].onclick=function(){ closeScreen(); };
  head.children[2].onclick=function(){ finishStrength(); };
  inner.appendChild(head);

  var timer=el('<div style="text-align:center;margin:-4px 0 16px"><span class="timer" id="wktime">0:00</span></div>');
  inner.appendChild(timer);

  if(draft.exercises.length===0){
    inner.appendChild(el('<div class="empty"><span class="big">No exercises yet.</span>Add one to get started.</div>'));
  }
  draft.exercises.forEach(function(ex,ei){ inner.appendChild(setBlock(ex,ei,"log")); });
  var add=el('<button class="btn ghost">+ Add exercise</button>');
  add.onclick=function(){ pickerMode="workout"; openPicker(); };
  inner.appendChild(add);

  runTimer();
}
function runTimer(){
  stopTimer();
  function tick(){
    var t=document.getElementById("wktime");
    if(!t||!draft){ stopTimer(); return; }
    t.textContent=fmtDur((Date.now()-draft.startTs)/1000,true);
  }
  tick();
  wkTimer=setInterval(tick,1000);
}
function finishStrength(){
  var anyDone=false, anyUndone=false;
  draft.exercises.forEach(function(ex){ ex.sets.forEach(function(x){
    if(x.reps||x.weight||x.min){ if(x.done) anyDone=true; else anyUndone=true; }
  }); });
  if(anyDone && anyUndone){
    uiConfirm("You haven't checked off all your sets. Finish anyway?", finishStrengthProceed);
    return;
  }
  finishStrengthProceed();
}
function finishStrengthProceed(){
  draft.exercises.forEach(function(ex){ ex.sets=ex.sets.filter(function(x){return x.reps||x.weight||x.min;}); });
  draft.exercises=draft.exercises.filter(function(ex){return ex.sets.length;});
  stopTimer();
  draft.durationSec=(Date.now()-draft.startTs)/1000;
  if(draft.exercises.length===0){ closeScreen(); return; }
  showSummary();
}

/* ---------- CARDIO ---------- */
function startCardio(){
  draft={ type:"cardio", ts:Date.now(), cardioType:"StairMaster", duration:25, intensity:"Easy (conversational)" };
  renderCardio(); openScreen();
}
function renderCardio(){
  var inner=document.getElementById("logInner"); inner.innerHTML="";
  var head=el('<div class="screen-head"><button class="link iconbtn" aria-label="Close"><svg class="hd-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><h2>Cardio</h2><button class="link done">Finish</button></div>');
  head.children[0].onclick=function(){ closeScreen(); };
  head.children[2].onclick=function(){ showSummary(); };
  inner.appendChild(head);

  var tf=el('<div class="field"><label>What are you doing?</label></div>');
  var chips=el('<div class="chips"></div>');
  CARDIO.forEach(function(c){
    var ch=el('<button class="chip'+(c===draft.cardioType?" on":"")+'">'+c+'</button>');
    ch.onclick=function(){ draft.cardioType=c; renderCardio(); };
    chips.appendChild(ch);
  });
  tf.appendChild(chips); inner.appendChild(tf);

  var df=el('<div class="field"><label>Duration (minutes)</label></div>');
  var di=el('<input type="number" min="0" inputmode="numeric" value="'+draft.duration+'">');
  di.oninput=function(){ clampNonNeg(di); draft.duration=di.value; };
  df.appendChild(di); inner.appendChild(df);

  var inf=el('<div class="field"><label>Intensity</label></div>');
  var ich=el('<div class="chips"></div>');
  ["Easy (conversational)","Moderate","Hard"].forEach(function(l){
    var ch=el('<button class="chip small'+(l===draft.intensity?" on":"")+'">'+l+'</button>');
    ch.onclick=function(){ draft.intensity=l; renderCardio(); };
    ich.appendChild(ch);
  });
  inf.appendChild(ich); inner.appendChild(inf);

  if(draft.cardioType==="StairMaster"){
    inner.appendChild(el('<div class="note"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>Around 20&ndash;30 min at a conversational pace keeps stress low. Feeling wound up rather than tired? It&rsquo;s fine to stop earlier.</span></div>'));
  }
}

/* ---------- SUMMARY (Save workout) ---------- */
function workoutTotals(){
  var vol=0,sets=0;
  draft.exercises.forEach(function(ex){
    ex.sets.forEach(function(s){
      if(ex.cardio){ if((Number(s.min)||0)>0) sets++; }
      else { var reps=Number(s.reps)||0, w=Number(s.weight)||0; if(reps>0){ sets++; vol+=w*reps; } }
    });
  });
  return { volume:vol, sets:sets };
}
function showSummary(){
  var inner=document.getElementById("logInner"); inner.innerHTML="";
  var head=el('<div class="screen-head"><button class="link iconbtn" aria-label="Back"><svg class="hd-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><h2>Save workout</h2><span style="width:44px"></span></div>');
  head.children[0].onclick=function(){ draft.type==="strength"?(renderStrength()):renderCardio(); };
  inner.appendChild(head);

  var name=draft.routineName?draft.routineName:(draft.type==="cardio"?draft.cardioType:"Workout");
  inner.appendChild(el('<h2 style="font-size:26px;margin:4px 2px 14px">'+esc(name)+'</h2>'));

  var stats=el('<div class="sum-stats"></div>');
  if(draft.type==="strength"){
    var t=workoutTotals();
    var durSec=draft.durationSec||0;
    stats.appendChild(el('<div class="s"><div class="lbl">Duration</div><div class="val blue">'+fmtDur(durSec,false)+'</div></div>'));
    stats.appendChild(el('<div class="s"><div class="lbl">Volume</div><div class="val">'+(Math.round(t.volume*10)/10)+' kg</div></div>'));
    stats.appendChild(el('<div class="s"><div class="lbl">Sets</div><div class="val">'+t.sets+'</div></div>'));
  }else{
    stats.appendChild(el('<div class="s"><div class="lbl">Duration</div><div class="val blue">'+(Number(draft.duration)||0)+' min</div></div>'));
    stats.appendChild(el('<div class="s"><div class="lbl">Type</div><div class="val" style="font-size:18px">'+esc(draft.cardioType)+'</div></div>'));
    stats.appendChild(el('<div class="s"><div class="lbl">Intensity</div><div class="val" style="font-size:15px;line-height:1.2">'+esc(draft.intensity.replace(" (conversational)",""))+'</div></div>'));
  }
  inner.appendChild(stats);

  if(draft.type==="strength"){
    var mp=aggregateLoad(draft.exercises);
    if(Object.keys(mp).length){
      inner.appendChild(el('<div class="sec-title">Muscles worked</div>'));
      inner.appendChild(musclePanel(draft.exercises));
    }
  }

  var nf=el('<div class="field" style="margin-top:18px"><label>Note (optional)</label></div>');
  var ta=el('<textarea placeholder="How did it go? Add a note…">'+(draft.notes?esc(draft.notes):"")+'</textarea>');
  ta.oninput=function(){ draft.notes=ta.value; };
  nf.appendChild(ta); inner.appendChild(nf);

  var savebtn=el('<button class="btn primary">Save workout</button>');
  savebtn.onclick=function(){ commitSession(); };
  inner.appendChild(savebtn);

  var disc=el('<button class="link danger" style="display:block;margin:16px auto 0">Discard workout</button>');
  disc.onclick=function(){ uiConfirm("Discard this workout?", function(){ closeScreen(); }, true); };
  inner.appendChild(disc);
}
function commitSession(){
  if(draft.type==="cardio") draft.durationSec=(Number(draft.duration)||0)*60;
  state.sessions.push(draft); save(); closeScreen(); showTab("workout");
}

/* ---------- PICKER (searchable) ---------- */
function openPicker(){
  stopTimer();
  var inner=document.getElementById("logInner"); inner.innerHTML="";
  var head=el('<div class="screen-head"><button class="link iconbtn" aria-label="Back"><svg class="hd-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><h2>Add exercise</h2><span style="width:44px"></span></div>');
  head.children[0].onclick=function(){ pickerMode==="routine"?renderRoutineEditor():renderStrength(); };
  inner.appendChild(head);

  var sf=el('<div class="field" style="margin-bottom:14px"></div>');
  var si=el('<input id="exsearch" placeholder="Search exercises…" autocomplete="off">');
  sf.appendChild(si); inner.appendChild(sf);

  inner.appendChild(el('<div id="pickerResults"></div>'));
  si.oninput=function(){ renderPickerResults(si.value); };
  renderPickerResults("");
  setTimeout(function(){ try{ si.focus(); }catch(e){} },40);
}
function allPickNames(){
  var names=[];
  for(var g in LIBRARY){ LIBRARY[g].forEach(function(n){ if(names.indexOf(n)<0) names.push(n); }); }
  CARDIO.forEach(function(n){ if(names.indexOf(n)<0) names.push(n); });
  state.customExercises.forEach(function(n){ if(names.indexOf(n)<0) names.push(n); });
  return names;
}
function pickerItem(n){
  var custom = state.customExercises.indexOf(n)>=0;
  var it=el('<button class="picker-item">'+thumb(n)+'<span style="flex:1;min-width:0">'+esc(n)+'</span>'+(custom?'<span class="custom-badge">Custom</span>':'')+'</button>');
  it.onclick=function(){ addExercise(n); };
  return it;
}
function renderPickerResults(query){
  var results=document.getElementById("pickerResults"); if(!results) return;
  results.innerHTML="";
  var q=(query||"").trim().toLowerCase();
  if(q===""){
    for(var g in LIBRARY){
      (function(g){
        var grp=el('<div class="picker-group"><div class="g">'+g+'</div></div>');
        LIBRARY[g].forEach(function(n){ grp.appendChild(pickerItem(n)); });
        results.appendChild(grp);
      })(g);
    }
    var cg=el('<div class="picker-group"><div class="g">Cardio</div></div>');
    CARDIO.forEach(function(n){ cg.appendChild(pickerItem(n)); });
    results.appendChild(cg);
    if(state.customExercises.length){
      var xg=el('<div class="picker-group"><div class="g">Custom</div></div>');
      state.customExercises.forEach(function(n){ xg.appendChild(pickerItem(n)); });
      results.appendChild(xg);
    }
    return;
  }
  var all=allPickNames();
  var matches=all.filter(function(n){ return n.toLowerCase().indexOf(q)>=0; });
  matches.sort(function(a,b){ return a.toLowerCase().indexOf(q)-b.toLowerCase().indexOf(q); });
  var grp=el('<div class="picker-group"></div>');
  matches.forEach(function(n){ grp.appendChild(pickerItem(n)); });
  results.appendChild(grp);
  var exact=all.some(function(n){ return n.toLowerCase()===q; });
  if(!exact){
    var addbtn=el('<button class="picker-item addnew"><span style="color:var(--blue);font-weight:700">+ Add &ldquo;'+esc(query.trim())+'&rdquo;</span></button>');
    addbtn.onclick=function(){ addNewCustom(query.trim()); };
    results.appendChild(addbtn);
  }
}
function pushExercise(name){
  var cardio=CARDIO.indexOf(name)>=0;
  if(pickerMode==="routine"){
    var setsR = cardio ? [{min:"",done:false}] : [{weight:"",reps:""},{weight:"",reps:""},{weight:"",reps:""}];
    routineDraft.exercises.push({ name:name, cardio:cardio, sets:setsR });
    renderRoutineEditor();
  }else{
    var setsL = cardio ? [{min:"",done:false}] : [{weight:"",reps:"",done:false}];
    draft.exercises.push({ name:name, cardio:cardio, sets:setsL });
    renderStrength();
  }
}
function addExercise(name){ pushExercise(name); }
function addNewCustom(name){ renderCustomMuscle(name); }
function renderCustomMuscle(name){
  var inner=document.getElementById("logInner"); inner.innerHTML="";
  var head=el('<div class="screen-head"><button class="link iconbtn" aria-label="Back"><svg class="hd-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><h2>Muscle group</h2><span style="width:44px"></span></div>');
  head.children[0].onclick=function(){ openPicker(); };
  inner.appendChild(head);
  inner.appendChild(el('<div style="color:var(--muted);font-size:14px;margin:2px 2px 16px;line-height:1.45">Which muscle group does &ldquo;'+esc(name)+'&rdquo; mainly train? This lets it count toward that muscle in your stats later.</div>'));
  var grp=el('<div class="picker-group"></div>');
  MUSCLE_GROUPS.forEach(function(m){
    var it=el('<button class="picker-item"><span>'+esc(m.label)+'</span></button>');
    it.onclick=function(){ finalizeCustom(name, m.id); };
    grp.appendChild(it);
  });
  inner.appendChild(grp);
}
function finalizeCustom(name, groupId){
  if(state.customExercises.indexOf(name)<0) state.customExercises.push(name);
  state.customData[name]={ p:[groupId], s:[], region:"Custom", mv:"—", t:"—" };
  save();
  pushExercise(name);
}

/* ---------- PROGRESS TAB ---------- */
function renderProgress(){
  var app=document.getElementById("app"); app.innerHTML="";
  app.appendChild(el('<div class="app-head"><div class="brand" style="font-size:22px">Progress</div></div>'));
  if(state.sessions.length===0){
    app.appendChild(el('<div class="empty" style="margin-top:40px"><span class="big">No data yet.</span>Once you log a few sessions, you&rsquo;ll see your rhythm here.</div>'));
    return;
  }
  var cols=el('<div class="cols"></div>');
  var left=el('<div class="col"></div>');
  var right=el('<div class="col"></div>');
  cols.appendChild(left); cols.appendChild(right);
  app.appendChild(cols);

  var total=state.sessions.length, wk=weekSessions().length;
  var grid=el('<div class="stat-grid"></div>');
  grid.appendChild(el('<div class="stat"><div class="num">'+wk+'</div><div class="lbl">sessions this week</div></div>'));
  grid.appendChild(el('<div class="stat"><div class="num">'+total+'</div><div class="lbl">total sessions</div></div>'));
  left.appendChild(grid);

  left.appendChild(el('<div class="sec-title">Rhythm &middot; last 6 weeks</div>'));
  var weeks=weeklyCounts(6);
  var maxc=Math.max(1,Math.max.apply(null,weeks.map(function(w){return w.count;})));
  var bars=el('<div class="card"><div class="bars"></div><div class="bars-x"></div></div>');
  var barsEl=bars.querySelector(".bars"),xEl=bars.querySelector(".bars-x");
  weeks.forEach(function(w,i){
    var h=Math.round((w.count/maxc)*80)+4;
    barsEl.appendChild(el('<div class="b'+(i===weeks.length-1?" hi":"")+'" style="height:'+h+'px">'+(w.count?'<span class="cap">'+w.count+'</span>':'')+'</div>'));
    xEl.appendChild(el('<span>'+w.label+'</span>'));
  });
  left.appendChild(bars);

  var exNames=strengthExerciseNames();
  if(exNames.length){
    left.appendChild(el('<div class="sec-title">Strength per exercise</div>'));
    var wrap=el('<div class="card"></div>');
    var sel=el('<select class="select-ex"></select>');
    exNames.forEach(function(n){ sel.appendChild(el('<option>'+esc(n)+'</option>')); });
    wrap.appendChild(sel);
    var chart=el('<div class="line-wrap"></div>'); wrap.appendChild(chart);
    sel.onchange=function(){ drawExChart(chart,sel.value); };
    left.appendChild(wrap);
    drawExChart(chart,exNames[0]);
  }

  right.appendChild(el('<div class="sec-title">History</div>'));
  state.sessions.slice().reverse().slice(0,20).forEach(function(s){ right.appendChild(sessionRow(s)); });
}
function sessionRow(s){
  var title,desc;
  if(s.type==="strength"){
    var done=s.exercises.filter(function(e){return e.sets.some(function(x){return x.reps||x.weight||x.min;});});
    var sets=0; done.forEach(function(e){ e.sets.forEach(function(x){ if(x.reps||x.weight||x.min) sets++; }); });
    title=s.routineName?s.routineName:"Workout";
    desc=(s.durationSec?fmtDur(s.durationSec,false)+" &middot; ":"")+done.length+" exercise"+(done.length===1?"":"s")+" &middot; "+sets+" set"+(sets===1?"":"s");
  }else{ title=s.cardioType; desc=s.duration+" min &middot; "+s.intensity.replace(" (conversational)",""); }
  var row=el('<div class="sess" style="cursor:pointer"></div>');
  row.appendChild(el('<div class="badge" style="color:'+(s.type==="strength"?"var(--blue)":"var(--orange)")+'">'+(s.type==="strength"?ICON_STRENGTH:ICON_CARDIO)+'</div>'));
  row.appendChild(el('<div class="meta"><div class="h">'+esc(title)+'</div><div class="d">'+fmtDate(s.ts)+' &middot; '+desc+'</div></div>'));
  row.appendChild(el('<div class="chev" style="color:var(--muted-2);font-size:20px">&rsaquo;</div>'));
  row.onclick=function(){ openSessionDetail(s); };
  return row;
}
function weeklyCounts(n){
  var mon=startOfWeek(),out=[];
  for(var i=n-1;i>=0;i--){
    var start=new Date(mon.getTime()-i*7*864e5),end=start.getTime()+7*864e5;
    var count=state.sessions.filter(function(s){return s.ts>=start.getTime()&&s.ts<end;}).length;
    out.push({count:count,label:start.getDate()+"/"+(start.getMonth()+1)});
  }
  return out;
}
function strengthExerciseNames(){
  var set={};
  state.sessions.forEach(function(s){ if(s.type==="strength") s.exercises.forEach(function(e){ set[e.name]=1; }); });
  return Object.keys(set);
}
function drawExChart(container,name){
  var pts=[];
  state.sessions.forEach(function(s){
    if(s.type!=="strength") return;
    s.exercises.forEach(function(e){
      if(e.name!==name) return;
      var best=0; e.sets.forEach(function(x){ var w=Number(x.weight)||0; if(w>best) best=w; });
      if(best>0) pts.push({ts:s.ts,w:best});
    });
  });
  container.innerHTML="";
  if(pts.length<2){ container.appendChild(el('<div style="color:var(--muted-2);font-size:13px;padding:14px 2px">Not enough data yet. Log this exercise a few times to see your line.</div>')); return; }
  var W=Math.max(300,pts.length*46),H=150,pad=26;
  var min=Math.min.apply(null,pts.map(function(p){return p.w;})),max=Math.max.apply(null,pts.map(function(p){return p.w;}));
  if(max===min) max=min+1;
  var xs=function(i){return pad+i*((W-2*pad)/(pts.length-1));};
  var ys=function(w){return H-pad-((w-min)/(max-min))*(H-2*pad);};
  var d=""; pts.forEach(function(p,i){ d+=(i?"L":"M")+xs(i).toFixed(1)+" "+ys(p.w).toFixed(1)+" "; });
  var svg='<svg width="'+W+'" height="'+H+'" style="display:block"><path d="'+d+'" fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
  pts.forEach(function(p,i){
    svg+='<circle cx="'+xs(i).toFixed(1)+'" cy="'+ys(p.w).toFixed(1)+'" r="4" fill="var(--blue)"/>';
    svg+='<text x="'+xs(i).toFixed(1)+'" y="'+(ys(p.w)-9).toFixed(1)+'" text-anchor="middle" font-size="10" fill="var(--muted)" font-family="Inter">'+p.w+'</text>';
  });
  svg+='</svg>';
  container.appendChild(el(svg));
  container.appendChild(el('<div style="font-size:11.5px;color:var(--muted-2);margin-top:4px">Best weight (kg) per session</div>'));
}

/* ---------- STATISTICS ---------- */
var BROAD={
  chest:"Chest",
  shoulders_front:"Shoulders", shoulders_side:"Shoulders", shoulders_rear:"Shoulders",
  biceps:"Arms", triceps:"Arms", forearms:"Arms",
  traps:"Back", lats:"Back", upper_back:"Back", lower_back:"Back",
  abs:"Core", obliques:"Core", hip_flexors:"Core",
  glutes:"Glutes", abductors:"Glutes", adductors:"Glutes",
  quadriceps:"Quadriceps", hamstrings:"Hamstrings", calves:"Calves"
};
var GROUP_ORDER=["Glutes","Hamstrings","Quadriceps","Calves","Back","Shoulders","Chest","Arms","Core"];
var DEFAULT_TARGETS={Glutes:[16,20],Hamstrings:[12,14],Quadriceps:[10,14],Calves:[8,10],Back:[4,6],Shoulders:[6,8],Chest:[6,8],Arms:[6,8],Core:[8,10]};
var statSub="sets", statWeekOffset=0;
var MONS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function statWeekStart(offset){ var mon=startOfWeek(); return new Date(mon.getTime()+offset*7*864e5); }
function weekSetsData(weekStartTs){
  var end=weekStartTs+7*864e5;
  var groups={}, reps={}, fine={}, totalSets=0, totalReps=0, totalVolume=0, totalDur=0, workouts=0;
  state.sessions.forEach(function(s){
    if(s.type!=="strength"||!s.exercises) return;
    if(s.ts<weekStartTs||s.ts>=end) return;
    workouts++; totalDur+=(s.durationSec||0);
    s.exercises.forEach(function(ex){
      var setCount=ex.sets.filter(function(x){return x.reps||x.weight||x.min;}).length;
      var repCount=0; ex.sets.forEach(function(x){ repCount+=Number(x.reps)||0; totalVolume+=(Number(x.weight)||0)*(Number(x.reps)||0); });
      totalSets+=setCount; totalReps+=repCount;
      var info=exInfo(ex.name); if(!info) return;
      var pf={}, sf={};
      info.p.forEach(function(id){ pf[id]=1; });
      info.s.forEach(function(id){ if(!pf[id]) sf[id]=1; });
      Object.keys(pf).forEach(function(id){ fine[id]=(fine[id]||0)+setCount; });
      Object.keys(sf).forEach(function(id){ fine[id]=(fine[id]||0)+setCount*0.5; });
      var pg={}, sg={};
      info.p.forEach(function(id){ if(BROAD[id]) pg[BROAD[id]]=1; });
      info.s.forEach(function(id){ if(BROAD[id] && !pg[BROAD[id]]) sg[BROAD[id]]=1; });
      Object.keys(pg).forEach(function(grp){ groups[grp]=(groups[grp]||0)+setCount; reps[grp]=(reps[grp]||0)+repCount; });
      Object.keys(sg).forEach(function(grp){ groups[grp]=(groups[grp]||0)+setCount*0.5; });
    });
  });
  return {groups:groups, reps:reps, fine:fine, totalSets:totalSets, totalReps:totalReps, totalVolume:totalVolume, totalDur:totalDur, workouts:workouts, start:weekStartTs, end:end};
}
function weekNav(app){
  var ws=statWeekStart(statWeekOffset), wsTs=ws.getTime(), end=new Date(wsTs+6*864e5);
  var label=ws.getDate()+" "+MONS[ws.getMonth()]+" – "+end.getDate()+" "+MONS[end.getMonth()];
  var title=statWeekOffset===0?"This week":(statWeekOffset===-1?"Last week":Math.abs(statWeekOffset)+" weeks ago");
  var nav=el('<div class="wknav"><button class="wkbtn">&#8592;</button><div class="wklbl"><div class="wkw">'+title+'</div><div class="wkr">'+label+'</div></div><button class="wkbtn">&#8594;</button></div>');
  nav.children[0].onclick=function(){ statWeekOffset--; renderStats(); };
  nav.children[2].onclick=function(){ if(statWeekOffset<0){ statWeekOffset++; renderStats(); } };
  if(statWeekOffset>=0) nav.children[2].style.opacity=".3";
  app.appendChild(nav);
  return weekSetsData(wsTs);
}
function renderStats(){
  var app=document.getElementById("app"); app.innerHTML="";
  app.appendChild(el('<div class="app-head"><div class="brand" style="font-size:22px">Statistics</div></div>'));
  var seg=el('<div class="detabs" style="margin-top:0"></div>');
  [["sets","Sets"],["body","Body"],["trends","Trends"]].forEach(function(t){
    var b=el('<button class="detab'+(statSub===t[0]?" on":"")+'">'+t[1]+'</button>');
    b.onclick=function(){ statSub=t[0]; renderStats(); };
    seg.appendChild(b);
  });
  app.appendChild(seg);
  if(statSub==="sets") renderStatsSets(app);
  else if(statSub==="body") renderStatsBody(app);
  else renderStatsTrends(app);
}
function renderStatsSets(app){
  var data=weekNav(app);
  app.appendChild(el('<div class="stat-grid"><div class="stat"><div class="num">'+data.totalSets+'</div><div class="lbl">total sets</div></div><div class="stat"><div class="num">'+data.totalReps+'</div><div class="lbl">total reps</div></div></div>'));
  app.appendChild(el('<div class="sec-title">Sets per muscle group</div>'));
  GROUP_ORDER.forEach(function(grp){
    var sets=Math.round((data.groups[grp]||0)*10)/10;
    var t=state.targets[grp]||DEFAULT_TARGETS[grp];
    var min=t[0], max=t[1];
    var status=sets<min?"Under":(sets>max?"Over":"On track");
    var scls=sets<min?"under":(sets>max?"over":"ontrack");
    var pct=Math.min(100, max?Math.round((sets/max)*100):0);
    var card=el('<div class="grp-card"></div>');
    card.appendChild(el('<div class="grp-top"><span class="grp-name">'+grp+'</span><span class="grp-status '+scls+'">'+status+'</span></div>'));
    card.appendChild(el('<div class="grp-row"><span class="grp-sets">'+sets+' sets</span><span class="grp-range">'+min+'–'+max+'</span></div>'));
    card.appendChild(el('<div class="grp-bar"><div class="grp-fill '+scls+'" style="width:'+pct+'%"></div></div>'));
    card.appendChild(el('<div class="grp-reps"><span>Total reps</span><span>'+(data.reps[grp]||0)+'</span></div>'));
    var ed=el('<button class="grp-edit">Edit target</button>');
    ed.onclick=function(){ openTargetEditor(grp); };
    card.appendChild(ed);
    app.appendChild(card);
  });
}
function openTargetEditor(grp){
  var t=state.targets[grp]||DEFAULT_TARGETS[grp];
  var back=el('<div class="dlg-back"></div>');
  var card=el('<div class="dlg"><div class="dlg-msg" style="margin-bottom:14px;font-weight:700">Weekly set target — '+esc(grp)+'</div></div>');
  var row=el('<div style="display:flex;gap:10px;margin-bottom:18px"></div>');
  var minW=el('<div style="flex:1"><div style="font-size:11px;color:var(--muted);font-weight:600;margin-bottom:5px">MIN</div></div>');
  var maxW=el('<div style="flex:1"><div style="font-size:11px;color:var(--muted);font-weight:600;margin-bottom:5px">MAX</div></div>');
  var minI=el('<input type="number" min="0" value="'+t[0]+'">');
  var maxI=el('<input type="number" min="0" value="'+t[1]+'">');
  minW.appendChild(minI); maxW.appendChild(maxI); row.appendChild(minW); row.appendChild(maxW); card.appendChild(row);
  var btns=el('<div class="dlg-btns"></div>');
  var cancel=el('<button class="dlg-b cancel">Cancel</button>');
  var ok=el('<button class="dlg-b ok">Save</button>');
  var close=function(){ if(back.parentNode) back.parentNode.removeChild(back); };
  cancel.onclick=close;
  ok.onclick=function(){ var mn=Math.max(0,Number(minI.value)||0), mx=Math.max(mn,Number(maxI.value)||mn); state.targets[grp]=[mn,mx]; save(); close(); renderStats(); };
  btns.appendChild(cancel); btns.appendChild(ok); card.appendChild(btns);
  back.appendChild(card); back.onclick=function(e){ if(e.target===back) close(); };
  document.body.appendChild(back);
}
function renderStatsBody(app){
  var data=weekNav(app);
  var fine=data.fine, ids=Object.keys(fine);
  var maxv=1; ids.forEach(function(id){ if(fine[id]>maxv)maxv=fine[id]; });
  var load={}; ids.forEach(function(id){ load[id]=fine[id]/maxv; });
  app.appendChild(muscleMapLoad(load));
  app.appendChild(el('<div class="mus-list-head" style="margin-top:16px"><span>Muscle</span><span>Sets</span></div>'));
  var list=el('<div class="body-list"></div>');
  list.appendChild(el('<div class="bl-row bl-total"><span>Total</span><span>'+data.totalSets+'</span></div>'));
  Object.keys(MUSCLE_LABEL).map(function(id){ return {id:id,label:MUSCLE_LABEL[id],v:Math.round((fine[id]||0)*10)/10}; })
    .sort(function(a,b){ return a.label<b.label?-1:1; })
    .forEach(function(m){ list.appendChild(el('<div class="bl-row"><span>'+esc(m.label)+'</span><span>'+m.v+'</span></div>')); });
  app.appendChild(list);
}
function radarChart(axes, cur, prev){
  var n=axes.length, cx=140, cy=138, R=98, maxv=1;
  axes.forEach(function(a){ maxv=Math.max(maxv, cur[a]||0, prev[a]||0); });
  function pt(i,val){ var ang=-Math.PI/2+i*2*Math.PI/n, r=R*((val||0)/maxv); return [cx+r*Math.cos(ang), cy+r*Math.sin(ang)]; }
  var svg='<svg viewBox="0 0 280 276" style="width:100%;max-width:330px;display:block;margin:0 auto">';
  for(var ring=1;ring<=4;ring++){
    var rp=[];
    for(var i=0;i<n;i++){ var ang=-Math.PI/2+i*2*Math.PI/n, r=R*ring/4; rp.push((cx+r*Math.cos(ang)).toFixed(1)+","+(cy+r*Math.sin(ang)).toFixed(1)); }
    svg+='<polygon points="'+rp.join(" ")+'" fill="none" stroke="var(--line)" stroke-width="1"/>';
  }
  for(var i=0;i<n;i++){
    var ang=-Math.PI/2+i*2*Math.PI/n, ex=cx+R*Math.cos(ang), ey=cy+R*Math.sin(ang);
    svg+='<line x1="'+cx+'" y1="'+cy+'" x2="'+ex.toFixed(1)+'" y2="'+ey.toFixed(1)+'" stroke="var(--line)" stroke-width="1"/>';
    var lx=cx+(R+20)*Math.cos(ang), ly=cy+(R+16)*Math.sin(ang);
    svg+='<text x="'+lx.toFixed(1)+'" y="'+ly.toFixed(1)+'" fill="var(--muted)" font-size="11" text-anchor="middle" dominant-baseline="middle">'+axes[i]+'</text>';
  }
  function poly(vals,stroke,fill){ var pp=[]; for(var i=0;i<n;i++){ var p=pt(i,vals[axes[i]]); pp.push(p[0].toFixed(1)+","+p[1].toFixed(1)); } return '<polygon points="'+pp.join(" ")+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"/>'; }
  svg+=poly(prev,"#8A8A90","rgba(150,150,155,.12)");
  svg+=poly(cur,"var(--blue)","rgba(47,128,255,.20)");
  svg+='</svg>';
  return el(svg);
}
function renderStatsTrends(app){
  var cur=weekSetsData(statWeekStart(0).getTime());
  var prev=weekSetsData(statWeekStart(-1).getTime());
  function radarVals(d){ return { Back:d.groups.Back||0, Chest:d.groups.Chest||0, Core:d.groups.Core||0, Shoulders:d.groups.Shoulders||0, Arms:d.groups.Arms||0, Legs:(d.groups.Glutes||0)+(d.groups.Quadriceps||0)+(d.groups.Hamstrings||0)+(d.groups.Calves||0) }; }
  app.appendChild(el('<div class="wkr" style="text-align:center;color:var(--muted-2);font-size:13px;margin:2px 0 10px">This week vs last week</div>'));
  app.appendChild(radarChart(["Back","Chest","Core","Shoulders","Legs","Arms"], radarVals(cur), radarVals(prev)));
  app.appendChild(el('<div class="mlegend"><span class="mlg"><span class="sw" style="background:var(--blue)"></span>Current</span><span class="mlg"><span class="sw" style="background:#8A8A90"></span>Previous</span></div>'));
  var grid=el('<div class="trend-grid"></div>');
  grid.appendChild(trendCard("Workouts", cur.workouts, prev.workouts, ""));
  grid.appendChild(trendCard("Duration", Math.round(cur.totalDur/60), Math.round(prev.totalDur/60), "min"));
  grid.appendChild(trendCard("Volume", Math.round(cur.totalVolume), Math.round(prev.totalVolume), " kg"));
  grid.appendChild(trendCard("Sets", cur.totalSets, prev.totalSets, ""));
  app.appendChild(grid);
}
function trendCard(label, curV, prevV, unit){
  var diff=curV-prevV, arrow=diff>0?"↑":(diff<0?"↓":"→"), col=diff>0?"var(--green)":(diff<0?"var(--sec)":"var(--muted-2)");
  return el('<div class="trend-card"><div class="tc-label">'+label+'</div><div class="tc-val">'+curV+unit+'</div><div class="tc-prev" style="color:'+col+'">'+arrow+' '+prevV+unit+'</div></div>');
}

/* ---------- tabs ---------- */
function showTab(tab){
  document.querySelectorAll("#nav button").forEach(function(b){ b.classList.toggle("on",b.getAttribute("data-tab")===tab); });
  window.scrollTo(0,0);
  if(tab==="workout") renderWorkout(); else if(tab==="progress") renderProgress(); else renderStats();
}
document.querySelectorAll("#nav button").forEach(function(b){ b.onclick=function(){ showTab(b.getAttribute("data-tab")); }; });

load(function(){ renderWorkout(); });
</script>
</body>
</html>
```