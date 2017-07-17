let fs = require('fs');
let clip = nw.Clipboard.get();
let openedFile = false;

window.onload = window.onresize = function () {
    document.body.style.overflow = 'hidden';
};

let menubar = new nw.Menu({ type: 'menubar', title: 'Menu Title' });
let submenuFile = new nw.Menu();
let submenuPravka = new nw.Menu();
let submenuRegime = new nw.Menu();

submenuFile.append(new nw.MenuItem({
    label: 'Открыть txt',
    click: function () {
        document.body.innerHTML = '';
        document.body.innerHTML = '<textarea id="text"></textarea>';
        document.body.style.overflow = 'hidden';
        let padding = 10;
        text.style.padding = padding + 'px';
        text.style.width = window.innerWidth - padding*2 + 'px';
        text.style.height = window.innerHeight - padding*2 + 'px';
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = function () {
            if(this.value === "") return;
            openedFile = this.value;
            let fr = new FileReader();
            fr.readAsText(this.files[0]);
            fr.onload = (info=> {
                console.log(info);
                text.value = info.target.result;
            });
        };
        input.click();
    }
}));
submenuFile.append(new nw.MenuItem({
    label: 'Сохранить',
    click:function () {
        if (!openedFile) return;
        fs.writeFile(openedFile, text.value, (err) => {
            if (err) alert(err);
        });
    }
}));
submenuFile.append(new nw.MenuItem({
    label: 'Сохранить как',
    click:function () {
        let input = document.createElement('input');
        input.type = 'file';
        input.nwsaveas = '*.txt';
        input.onchange = function () {
            if (this.value === '') return;
            openedFile = this.value;
            let filePath = this.value;
            fs.writeFile(filePath, text.value, (err) => {
                if (err) alert(err);
            });
        };
        input.click();
    }
}));
submenuFile.append(new nw.MenuItem({
    label: 'Изображение',
    click:function () {
        document.body.innerHTML = '';
        document.body.innerHTML = '<img src="" id="myImage" alt="">';
        let img = document.getElementById('myImage');
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = function getImage (){
            let fr = new FileReader();
            fr.readAsDataURL(this.files[0]);
            fr.onload = function (e) {
                img.style.width = 'auto';
                img.style.height = '600px';
                img.style.margin = '10px 0 0 170px';
                img.style.boxShadow = '0 10px 10px #333';
                img.src = this.result;
            };
        };
            input.click();
    }
}));

menubar.append(new nw.MenuItem({label: 'Файл', submenu: submenuFile,}));

submenuPravka.append(new nw.MenuItem({
    label: 'Копировать',
    click:function () {
        if (!clip)return alert('error');
        clip.set(text.value.substring(text.selectionStart, text.selectionEnd));
    }
}));
submenuPravka.append(new nw.MenuItem({
    label: 'Вставить',
    click:function () {
        if (!clip)return alert('error');
        let buf = clip.get();
        let start = text.selectionStart;
        text.value = text.value.substr(0, text.selectionStart)+buf+text.value.substr(text.selectionEnd);// после курсор становится в конец text.value
        text.selectionStart = text.selectionEnd = start + buf.length;
        text.focus();
    }
}));

menubar.append(new nw.MenuItem({label: 'Правка', submenu: submenuPravka,}));

submenuRegime.append(new nw.MenuItem({
    label: 'День',
    click:function () {
        let text = document.getElementById('text');
        text.style.color = 'black';
        text.style.backgroundColor = 'white';
    }
}));

submenuRegime.append(new nw.MenuItem({
    label: 'Ночь',
    click:function () {
        let text = document.getElementById('text');
        text.style.color = 'white';
        text.style.backgroundColor = 'black';
    }
}));

menubar.append(new nw.MenuItem({label: 'Режим', submenu: submenuRegime,}));

nw.Window.get().menu = menubar;
