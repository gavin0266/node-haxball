export default function TurkishLanguage(API){
  const { ErrorCodes, ConnectionState, RendererTextIndices } = API.Language.indices;
  const { K } = API.Impl.Utils;

  const ErrorsTextMap = {
    [ErrorCodes.Empty]: ()=>"",
    [ErrorCodes.ConnectionClosed]: (reason)=>"Bağlantı kapatıldı"+((reason!=null)?" ("+reason+")":""),
    [ErrorCodes.GameStateTimeout]: ()=>"Oyun durumu süre aşımı",
    [ErrorCodes.RoomClosed]: ()=>"Oda kapatıldı.",  
    [ErrorCodes.RoomFull]: ()=>"Oda dolu.",
    [ErrorCodes.WrongPassword]: ()=>"Şifre yanlış.",
    [ErrorCodes.BannedBefore]: ()=>"Bu odadan yasaklanmışsınız.",
    [ErrorCodes.IncompatibleVersion]: ()=>"Uyumsuz oyun sürümü.",
    [ErrorCodes.FailedHost]: ()=>"Oda sunucusuna bağlanılamadı. Problem devam ederse şu rehbere bakınız: https://github.com/haxball/haxball-issues/wiki/Connection-Issues",
    [ErrorCodes.Unknown]: ()=>"Odaya girerken bir problem oluştu.<br><br>Bunun nedeni bir tarayıcı eklentisi olabilir, bütün eklentileri devre dışı bırakıp siteyi yenilemeyi deneyiniz.<br><br>Oluşan hata mesajı konsola yazdırıldı.",
    [ErrorCodes.Cancelled]: ()=>"İptal edildi",
    [ErrorCodes.FailedPeer]: ()=>"Eşe bağlanılamadı.",
    [ErrorCodes.KickedNow]: (reason, ban, byName)=>(byName?.length>0?(byName+" tarafından O"):"o")+"dadan "+(ban?"yasaklandınız":"atıldınız")+(reason?.length>0?(" ("+reason+")"):""),
    [ErrorCodes.Failed]: ()=>"Başarısız",
    [ErrorCodes.MasterConnectionError]: ()=>"Ana sunucu bağlantı hatası",
    [ErrorCodes.StadiumParseError]: (section, index)=>"\"" + section + "\" bölümü, " + index + " konumunda hata.",
    [ErrorCodes.StadiumParseSyntaxError]: (lineNumber)=>lineNumber + " satırında sözdizimi hatası",
    [ErrorCodes.StadiumParseUnknownError]: ()=>"Stadyum dosyası açılırken hata.",
    [ErrorCodes.ObjectCastError]: (object, type)=>K.ye(object) + " nesnesi şu tipe dönüştürülemiyor: " + K.ye(type),
    [ErrorCodes.TeamColorsReadError]: ()=>"Çok fazla",
    [ErrorCodes.UTF8CharacterDecodeError]: (offset, charCode)=>offset + " konumundaki UTF8 karakteri çözülemedi: karakter kodu (" + charCode + ") geçersiz",
    [ErrorCodes.ReadTooMuchError]: ()=>"Çok fazla okundu",
    [ErrorCodes.ReadWrongStringLengthError]: (expectedLength)=>"Gerçek yazı uzunluğu belirtilenden farklı: " + expectedLength + " byte",
    [ErrorCodes.EncodeUTF8CharNegativeError]: (num)=>"UTF8 karakteri çözülemedi: karakter kodu (" + num + ") negatif",
    [ErrorCodes.EncodeUTF8CharTooLargeError]: (num)=>"UTF8 karakteri çözülemedi: karakter kodu (" + num + ") çok büyük (>= 0x80000000)",
    [ErrorCodes.CalculateLengthOfUTF8CharNegativeError]: (num)=>"UTF8 karakterinin uzunluğu hesaplanamadı: karakter kodu (" + num + ") negatif",
    [ErrorCodes.CalculateLengthOfUTF8CharTooLargeError]: (num)=>"UTF8 karakterinin uzunluğu hesaplanamadı: karakter kodu (" + num + ") çok büyük (>= 0x80000000)",
    [ErrorCodes.BufferResizeParameterTooSmallError]: ()=>"Buffer 1 byte kapasitesinden küçük bir değere yeniden boyutlandırılamadı",
    [ErrorCodes.BadColorError]: ()=>"Kötü renk",
    [ErrorCodes.BadTeamError]: ()=>"Kötü takım değeri",
    [ErrorCodes.StadiumLimitsExceededError]: ()=>"Hata",
    [ErrorCodes.MissingActionConfigError]: ()=>"Sınıfın ayarı yok",
    [ErrorCodes.UnregisteredActionError]: ()=>"Kayıtsız bir hareket paketlenmeye çalışıldı.",
    [ErrorCodes.MissingImplementationError]: ()=>"Fonksiyon kodları eksik",
    [ErrorCodes.AnnouncementActionMessageTooLongError]: ()=>"Mesaj çok uzun",
    [ErrorCodes.ChatActionMessageTooLongError]: ()=>"Mesaj çok uzun",
    [ErrorCodes.KickBanReasonTooLongError]: ()=>"Yazı çok uzun",
    [ErrorCodes.ChangeTeamColorsInvalidTeamIdError]: ()=>"Geçersiz takım idsi",
    [ErrorCodes.MissingRecaptchaCallbackError]: ()=>"Recaptcha talep edildi. Oda oluştururken yada odaya girerken ya onRequestRecaptcha callbackine atama yapın yada çalışan bir token ayarlayın.",
    [ErrorCodes.ReplayFileVersionMismatchError]: ()=>"Tekrarlama verisinin sürümü farklı",
    [ErrorCodes.ReplayFileReadError]: ()=>"Tekrarlama verisi yüklenemedi.",
    [ErrorCodes.JoinRoomNullIdAuthError]: ()=>"id ve authObj null olamaz. (1. parametrede)",
    [ErrorCodes.PlayerNameTooLongError]: (conn, auth, name)=>"İsim çok uzun",
    [ErrorCodes.PlayerCountryTooLongError]: (conn, auth, name, flag)=>"Bayrak çok uzun",
    [ErrorCodes.PlayerAvatarTooLongError]: (conn, auth, name, flag, avatar)=>"Avatar çok uzun",
    [ErrorCodes.PlayerJoinBlockedByMPDError]: (conn, auth, name, flag, avatar)=>"Oyuncu girişine izin verilmedi: " + name + " " + flag + " " + avatar + " " + conn + " " + auth,
    [ErrorCodes.PlayerJoinBlockedByORError]: (playerObj)=>"Oyuncu giriş olayı OperationReceived tarafından engellendi: " + playerObj,
    [ErrorCodes.PluginNotFoundError]: (pluginIndex)=>pluginIndex + " konumunda eklenti bulunamadı",
    [ErrorCodes.PluginNameChangeNotAllowedError]: ()=>"Eklenti adı değişmemeli",
    [ErrorCodes.LibraryNotFoundError]: (libraryIndex)=>libraryIndex + "konumunda kütüphane bulunamadı",
    [ErrorCodes.LibraryNameChangeNotAllowedError]: ()=>"Kütüphane adı değişmemeli",
    [ErrorCodes.AuthFromKeyInvalidIdFormatError]: ()=>"Id formatı geçersiz",
    [ErrorCodes.LanguageAlreadyExistsError]: (abbr)=>"Dil zaten mevcut: " + abbr,
    [ErrorCodes.CurrentLanguageRemovalError]: ()=>"Seçili dil silinemez. Önce başka bir dil seçiniz.",
    [ErrorCodes.LanguageDoesNotExistError]: (abbr)=>"Dil mevcut değil: " + abbr,
    [ErrorCodes.BadActorError]: ()=>"Kötü Aktör"
  };

  const ConnectionStateTextMap = {
    [ConnectionState.ConnectingToMaster]: "Ana sunucuya bağlanılıyor",
    [ConnectionState.ConnectingToPeer]: "Eşe bağlanılıyor",
    [ConnectionState.AwaitingState]: "Durum bekleniyor",
    [ConnectionState.Active]: "Aktif",
    [ConnectionState.ConnectionFailed]: "Bağlantı Başarısız",
  };

  const RendererTextMap = {
    [RendererTextIndices.timeIsUp1]: "Süre", 
    [RendererTextIndices.timeIsUp2]: "Doldu!", 
    [RendererTextIndices.redIsVictorious1]: "Kırmızı Takım", 
    [RendererTextIndices.redIsVictorious2]: "Kazandı!", 
    [RendererTextIndices.redScores1]: "Kırmızı Takım", 
    [RendererTextIndices.redScores2]: "Gol Attı!", 
    [RendererTextIndices.blueIsVictorious1]: "Mavi Takım", 
    [RendererTextIndices.blueIsVictorious2]: "Kazandı!", 
    [RendererTextIndices.blueScores1]: "Mavi Takım", 
    [RendererTextIndices.blueScores2]: "Gol Attı!", 
    [RendererTextIndices.gamePaused1]: "Oyun", 
    [RendererTextIndices.gamePaused2]: "Durduruldu" 
  };

  return [ErrorsTextMap, ConnectionStateTextMap, RendererTextMap];
};
